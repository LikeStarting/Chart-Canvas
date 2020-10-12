import { Periodicity } from '../config/Constant'
import TSLoader from './tsLoader'

class DataConfig {
  constructor (data) {
    this._data = data

    this.setPeriodicity(data.periodicity)
    this.setMarketTime(data.marketTime)

    this.tsLoader = new TSLoader(
      this.periodicity,
      data.dateRange,
      this.marketTime,
      data.holidays,
      data.prices,
      this.getTimeSeries(data)
    )
  }

  get holidays () {
    return this.tsLoader.holidays
  }

  get prices () {
    return this.tsLoader.prices
  }

  get timeSeries () {
    return this.tsLoader.timeSeries
  }

  getDateRange (prices) {
    return [prices[0].date, prices[prices.length - 1].date]
  }

  getRenderTimeSeries () {
    return this.tsLoader.getRenderTimeSeries()
  }

  setPeriodicity (periodicity) {
    if (typeof periodicity !== 'undefined') {
      if (!Object.values(Periodicity).includes(periodicity)) {
        throw new Error(`Can't support the periodicity: ${periodicity}.`)
      }
    }

    this.periodicity = periodicity || 1
  }

  setMarketTime (marketTime) {
    this.marketTime = []
    const getHM = (str) => {
      const HM = str.split(':')
      return {
        hour: parseInt(HM[0], 10),
        minute: parseInt(HM[1], 10)
      }
    }
    marketTime.forEach(mt => {
      const [start, end] = mt
      const startHM = getHM(start)
      const endHM = getHM(end)
      this.marketTime.push([startHM, endHM])
    })
  }

  getTimeSeries (data) {
    const timeSeries = {}

    Object.keys(data).forEach(k => {
      if (k.startsWith('ts')) {
        timeSeries[k] = data[k]
      }
    })

    return timeSeries
  }
}

export default DataConfig
