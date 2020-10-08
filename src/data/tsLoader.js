import timeGap from './fixGap'
import highLow from './highLow'

class TSLoader {
  constructor (periodicity, dateRange, marketTime, holidays, prices, timeSeries) {
    this.periodicity = periodicity
    this.marketTime = marketTime
    this.holidays = holidays

    this.initPrices(prices)
    this.setTimeSeries(timeSeries)
  }

  get holidays () {
    return this._holidays
  }

  get prices () {
    return this._prices
  }

  get timeSeries () {
    return this._timeSeries
  }

  set holidays (holidays = []) {
    if (holidays.length > 0) {
      for (const day of holidays) {
        if (day instanceof Date === false) {
          throw new Error(`wrong date for holidays: ${day}`)
        }
      }
    }

    this._holidays = holidays.sort((a, b) => a > b ? 1 : -1)
  }

  initPrices (value) {
    this.pricesLoader = null

    let _prices = value
    if (typeof value === 'function') {
      this.pricesLoader = value
      _prices = [{ date: new Date(this.dateRange.end) }]
    } else {

    }

    this.setPrices(_prices)
  }

  setPrices (_prices) {
    let prices = [..._prices]

    prices = timeGap.fix(
      prices,
      this.periodicity,
      this.marketTime,
      this.holidays
    )

    this.calcPriceChg(prices)
    this.calcHighLow(prices)

    this._prices = prices
  }

  calcPriceChg (prices) {
    let previous = null

    for (const [i, p] of prices.entries()) {
      if (p.close) {
        if (i === 0) {
          p.chg = 0
          p.chgPct = 0
          p.volumeChg = 0
        } else if (previous.close) {
          p.chg = p.close - previous.close
          p.chgPct = p.chg / p.close
          p.volumeChg = p.volume - previous.volume
        } else if (p.prevClose) {
          p.chg = p.close - p.prevClose
          p.chgPct = p.chg / p.close
          p.volumeChg = 0
        } else {
          p.chg = 0
          p.chgPct = 0
          p.volumeChg = 0
        }
      }

      if (previous) p.previous = previous
      if (!previous || p.close) previous = p
    }
  }

  calcHighLow (prices) {

  }

  setTimeSeries () {

  }
}

export default TSLoader
