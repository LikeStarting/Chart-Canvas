import timeGap from './fixGap'
import highLow from './highLow'

class TSLoader {
  constructor (periodicity, dateRange, marketTime, holidays, prices, timeSeries) {
    this.periodicity = periodicity
    this.marketTime = marketTime
    this.holidays = holidays

    this.initPrices(prices)
    this.setTimeSeries(timeSeries)

    this.offsetBarNumber = 0
    this.startIndex = 0
    this.endIndex = 0
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

  async getRenderTimeSeries (width, tickWidth, offsetX) {
    const length = this.prices.length
    const counts = width / tickWidth
    const minOffsetBarNumber = counts - length
    const x = offsetX === undefined ? 0 : offsetX

    this.offsetBarNumber = this.offsetBarNumber - x / tickWidth

    if (this.offsetBarNumber < minOffsetBarNumber) {
      this.offsetBarNumber = minOffsetBarNumber
    }

    this.endIndex = Math.round(length + this.offsetBarNumber)

    if (this.endIndex > length) this.endIndex = length

    this.startIndex = this.endIndex - counts

    if (this.startIndex < 0) this.startIndex = 0
    const result = await this.sliceTimeSeries(this.startIndex, this.endIndex)

    return result
  }

  async sliceTimeSeries (start, end) {
    const renderPrices = this.slicePrice(start, end)
    const result = {}
    result.prices = renderPrices
    result.volume = renderPrices.map(ts => ({
      date: ts.date,
      value: ts.volume
    }))

    return result
  }

  slicePrice (start, end) {
    return this.prices.slice(start, end)
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

  setViewPrices (_prices) {
    const prices = [..._prices]

    this.viewPrices = prices
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
