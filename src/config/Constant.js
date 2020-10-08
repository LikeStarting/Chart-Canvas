export const ChartType = Object.freeze({
  GRID: 'grid',
  AXIS: 'axis',
  LINE: 'line',
  BAR: 'bar',
  OHLC: 'ohlc',
  HLC: 'hlc',
  CROSSHAIR: 'crosshair',
  PATTERN: 'pattern',
  CANDLESTICK: 'candlestick',
  TRACKER: 'tracker'
})

export const TimeInterval = Object.freeze({
  M1: 'M1',
  M5: 'M5',
  M10: 'M10',
  M15: 'M15',
  M30: 'M30',
  M45: 'M45',
  M60: 'M60',
  M120: 'M120',
  M180: 'M180',
  H12: 'H12',
  D1: 'D1',
  D2: 'D2',
  W1: 'W1',
  W2: 'W2',
  m1: 'm1',
  Q1: 'Q1',
  S1: 'S1',
  Y1: 'Y1'
})

export const ScaleType = Object.freeze({
  LINEAR: 'linear',
  LOG: 'log',
  POW: 'pow'
})

export const Periodicity = Object.freeze({
  DAILY: 1,
  WEEKLY: 2,
  MONTHLY: 3,
  MINUTE1: 4,
  MINUTE5: 5,
  MINUTE10: 6,
  MINUTE15: 7,
  MINUTE30: 8,
  MINUTE60: 9
})
