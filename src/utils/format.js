export function formatNum (number, decimal = 1) {
  const units = ['', 'K', 'M', 'B', 'T']
  const unit = units[Math.log10(number) / 3 | 0] !== undefined ? units[Math.log10(number) / 3 | 0] : units[units.length - 1]
  const exponent = unit === units[units.length - 1] ? units.length - 1 : Math.log10(number) / 3 | 0
  return (number / Math.pow(10, exponent * 3)).toFixed(decimal) + unit
}
