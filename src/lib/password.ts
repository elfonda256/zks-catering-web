import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";

const DEFAULT_N = 131072; // 2^17
const DEFAULT_R = 8;
const DEFAULT_P = 1;
const DEFAULT_KEYLEN = 64; // 64 bytes = 512 bits
const DEFAULT_MAXMEM = 140 * 1024 * 1024; // 140 MiB

// Reasonable upper bounds to prevent Denial of Service via parameter exhaustion
const MAX_N = 1048576; // 2^20 (~1 GiB if unchecked)
const MAX_R = 32;
const MAX_P = 16;
const MAX_KEYLEN = 128;
const MAX_ALLOWED_MAXMEM = 256 * 1024 * 1024; // 256 MiB ceiling

function scryptAsync(
  password: string | Buffer,
  salt: Buffer,
  keylen: number,
  options: { cost: number; blockSize: number; parallelization: number; maxmem: number }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey);
    });
  });
}

/**
 * Hash password asynchronously using scrypt with OWASP recommended cost parameters.
 * Format: $scrypt$N=131072,r=8,p=1$<salt-hex>$<hash-hex>
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("Password must be a non-empty string");
  }

  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, DEFAULT_KEYLEN, {
    cost: DEFAULT_N,
    blockSize: DEFAULT_R,
    parallelization: DEFAULT_P,
    maxmem: DEFAULT_MAXMEM,
  });

  const saltHex = salt.toString("hex");
  const hashHex = derivedKey.toString("hex");

  return `$scrypt$N=${DEFAULT_N},r=${DEFAULT_R},p=${DEFAULT_P}$${saltHex}$${hashHex}`;
}

/**
 * Verify password against stored scrypt hash string in constant-time.
 * Returns false on mismatch or malformed hash format.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (typeof password !== "string" || typeof storedHash !== "string") {
    return false;
  }

  // Parse $scrypt$N=<int>,r=<int>,p=<int>$<salt-hex>$<hash-hex>
  const match = /^\$scrypt\$N=(\d+),r=(\d+),p=(\d+)\$([0-9a-fA-F]+)\$([0-9a-fA-F]+)$/.exec(storedHash);
  if (!match) {
    return false;
  }

  const cost = parseInt(match[1], 10);
  const blockSize = parseInt(match[2], 10);
  const parallelization = parseInt(match[3], 10);
  const saltHex = match[4];
  const hashHex = match[5];

  // Bounds check: cost must be power of two > 1 and <= MAX_N
  if (
    Number.isNaN(cost) ||
    cost <= 1 ||
    (cost & (cost - 1)) !== 0 ||
    cost > MAX_N ||
    Number.isNaN(blockSize) ||
    blockSize < 1 ||
    blockSize > MAX_R ||
    Number.isNaN(parallelization) ||
    parallelization < 1 ||
    parallelization > MAX_P
  ) {
    return false;
  }

  // Salt check: minimum 16 bytes (32 hex characters)
  if (saltHex.length < 32 || saltHex.length % 2 !== 0) {
    return false;
  }

  // Hash check: even number of hex characters, valid keylen
  if (hashHex.length === 0 || hashHex.length % 2 !== 0) {
    return false;
  }

  const expectedKeylen = hashHex.length / 2;
  if (expectedKeylen > MAX_KEYLEN) {
    return false;
  }

  // Calculate memory required by scrypt: approximately 128 * cost * blockSize bytes
  const requiredMem = 128 * cost * blockSize;
  const maxmem = Math.max(DEFAULT_MAXMEM, Math.min(requiredMem * 2, MAX_ALLOWED_MAXMEM));
  if (requiredMem > MAX_ALLOWED_MAXMEM) {
    return false;
  }

  try {
    const saltBuffer = Buffer.from(saltHex, "hex");
    const storedHashBuffer = Buffer.from(hashHex, "hex");

    const derivedKey = await scryptAsync(password, saltBuffer, expectedKeylen, {
      cost,
      blockSize,
      parallelization,
      maxmem,
    });

    if (derivedKey.length !== storedHashBuffer.length) {
      return false;
    }

    return timingSafeEqual(derivedKey, storedHashBuffer);
  } catch {
    return false;
  }
}
