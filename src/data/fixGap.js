import { Periodicity } from '../config/Constant'

import timeUtils from '../utils/time'

class FixGap {
  fix (prices, periodicity, marketTime, holidays) {
    if (prices.length === 0) return prices

    prices.sort((a, b) => a.date > b.date ? 1 : -1)
    const minDate = prices[0].date
    const maxDate = prices[prices.length - 1].date

    let result = null

    switch (periodicity) {
      case Periodicity.DAILY:
        result = this.fixDailyGap(prices, marketTime, holidays, minDate, maxDate)
        break
    }

    result.sort((a, b) => (a.date > b.date ? 1 : -1))
    return result
  }

  checkMap (p, tsMap, key) {
    const _key = key || p.date.valueOf()

    const value = tsMap.get(_key)
    if (value) {
      if ((value.close && !p.close) || (value.value && !p.value)) return
    }

    tsMap.set(key, p)
  }

  fixDailyGap (prices, marketTime, holidays, minDate, maxDate) {
    const result = []

    const tsMap = new Map()
    const { hour, minute } = marketTime[marketTime.length - 1][1]

    const genKey = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).valueOf()

    prices.forEach(p => {
      this.checkMap(p, tsMap, genKey(p.date))
    })

    const tmpDate = new Date(minDate)
    tmpDate.setHours(hour)
    tmpDate.setMinutes(minute)

    while (tmpDate <= maxDate) {
      if (timeUtils.isTradingDay(tmpDate, holidays)) {
        let d = tsMap.get(genKey(tmpDate))
        if (!d) {
          d = { date: new Date(tmpDate), volume: 0 }
        }
        d.date = new Date(tmpDate)
        result.push(d)
      }

      tmpDate.setDate(tmpDate.getDate() + 1)
    }
    return result
  }
}

const timeGap = new FixGap()
export default timeGap
