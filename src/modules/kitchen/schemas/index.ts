export function validateCoreTemp(temp: number): { isValid: boolean; compliant: boolean } {
  return {
    isValid: !isNaN(temp),
    compliant: temp >= 75,
  };
}
