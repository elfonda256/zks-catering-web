import { FIELD_HINT, FIELD_LABEL, REQUIRED_MARK } from "@/components/site/form";
import { LARGE_ORDER_PCS, MIN_ORDER_PCS } from "@/lib/order-rules";

const QUICK_PICKS = [50, 100, 250, 500];
const STEP = 10;

interface QuantityFieldProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

const STEPPER_BUTTON =
  "flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center text-2xl text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E07A35] disabled:cursor-not-allowed disabled:opacity-40";

export function QuantityField({ value, onChange, disabled }: QuantityFieldProps) {
  const isLarge = value >= LARGE_ORDER_PCS;

  return (
    <div className="space-y-3">
      <label htmlFor="quantity" className={FIELD_LABEL}>
        Jumlah porsi<span className={REQUIRED_MARK}> *</span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-stretch overflow-hidden rounded-full border border-white/15 bg-[#232A2E]">
          <button
            type="button"
            onClick={() => onChange(Math.max(MIN_ORDER_PCS, value - STEP))}
            disabled={disabled || value <= MIN_ORDER_PCS}
            aria-label={`Kurangi ${STEP} porsi`}
            className={STEPPER_BUTTON}
          >
            −
          </button>
          <input
            id="quantity"
            name="quantity"
            type="number"
            inputMode="numeric"
            min={MIN_ORDER_PCS}
            step={1}
            required
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            aria-describedby="quantity-hint"
            className="w-24 bg-transparent text-center font-heading text-xl font-bold text-white [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => onChange((value || 0) + STEP)}
            disabled={disabled}
            aria-label={`Tambah ${STEP} porsi`}
            className={STEPPER_BUTTON}
          >
            +
          </button>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Pilihan cepat jumlah porsi">
          {QUICK_PICKS.map((pick) => (
            <button
              key={pick}
              type="button"
              onClick={() => onChange(pick)}
              disabled={disabled}
              aria-pressed={value === pick}
              className={`min-h-11 cursor-pointer rounded-full border px-4 font-heading text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E07A35] ${
                value === pick
                  ? "border-[#C85A17] bg-[#C85A17] text-white"
                  : "border-white/20 text-white/85 hover:border-white/50"
              }`}
            >
              {pick}
            </button>
          ))}
        </div>
      </div>

      <p id="quantity-hint" className={FIELD_HINT}>
        Minimal {MIN_ORDER_PCS} porsi.{" "}
        {isLarge ? (
          <span className="font-medium text-[#E07A35]">
            Mulai {LARGE_ORDER_PCS} porsi, pesan paling lambat H-3 sebelum acara.
          </span>
        ) : (
          <>Pesan paling lambat H-1 sebelum acara.</>
        )}
      </p>
    </div>
  );
}
