import timeUtils from '../utils/time'

import { TimeInterval } from '../config/Constant'

class TickX {
  getTicks (minDate, maxDate, interval, tradeTime, holidays, periodicity) {
    let timeTicks = []

    switch (interval) {
      case TimeInterval.D1:
        timeTicks = this.daily(minDate, maxDate, tradeTime, holidays, 1)
        break
      case TimeInterval.D2:
        timeTicks = this.daily(minDate, maxDate, tradeTime, holidays, 2)
        break
      case TimeInterval.W1:
        timeTicks = this.weekly(minDate, maxDate, tradeTime, holidays, 1)
        break
      case TimeInterval.W2:
        timeTicks = this.weekly(minDate, maxDate, tradeTime, holidays, 2)
        break
      case TimeInterval.m1:
        timeTicks = this.monthly(minDate, maxDate, tradeTime, holidays)
        break
      case TimeInterval.Q1:
        timeTicks = this.quarterly(minDate, maxDate, tradeTime, holidays)
        break
    }

    return timeTicks
  }

  daily (minDate, maxDate, tradeTime, holidays, interval) {
    const timeTicks = []
    const { hour, minute } = timeUtils.getTradeCloseTime(tradeTime)

    const tmpDate = new Date(minDate)
    tmpDate.setHours(hour)
    tmpDate.setMinutes(minute)

    // eslint-disable-next-line no-unmodified-loop-condition
    while (tmpDate <= maxDate) {
      if (timeUtils.isTradingDay(tmpDate, holidays)) {
        timeTicks.push(new Date(tmpDate))
      }

      for (let i = 0; i < interval; i++) {
        tmpDate.setDate(tmpDate.getDate() + 1)
        while (!timeUtils.isTradingDay(tmpDate, holidays)) {
          tmpDate.setDate(tmpDate.getDate() + 1)
        }
      }
    }

    return timeTicks
  }

  weekly (minDate, maxDate, tradeTime, holidays, interval) {
    const timeTicks = []
    const { hour, minute } = timeUtils.getTradeCloseTime(tradeTime)

    const tmpDate = timeUtils.toWeekday(minDate, 5)
    tmpDate.setHours(hour)
    tmpDate.setMinutes(minute)

    const tmpMaxDate = timeUtils.toFriday(maxDate)
    tmpMaxDate.setHours(hour)
    tmpMaxDate.setMinutes(minute)

    // eslint-disable-next-line no-unmodified-loop-condition
    while (tmpDate <= tmpMaxDate) {
      timeTicks.push(timeUtils.toFriday(tmpDate, holidays))
      tmpDate.setDate(tmpDate.getDate() + 7 * interval)
    }

    return timeTicks
  }

  monthly (minDate, maxDate, tradeTime, holidays) {
    const timeTicks = []
    const { hour, minute } = timeUtils.getTradeCloseTime(tradeTime)

    let tmpDate = new Date(minDate)
    tmpDate.setHours(hour)
    tmpDate.setMinutes(minute)

    const tmpMaxDate = timeUtils.toMonthEnd(maxDate, holidays)
    tmpMaxDate.setHours(hour)
    tmpMaxDate.setMinutes(minute)

    // eslint-disable-next-line no-unmodified-loop-condition
    while (tmpDate <= tmpMaxDate) {
      tmpDate = timeUtils.toMonthEnd(tmpDate, holidays)

      timeTicks.push(tmpDate)
      tmpDate = new Date(tmpDate.getFullYear(), tmpDate.getMonth() + 1, 1, hour, minute)
    }

    return timeTicks
  }

  quarterly (minDate, maxDate, tradeTime, holidays) {
    const timeTicks = []
    const { hour, minute } = timeUtils.getTradeCloseTime(tradeTime)

    let tmpDate = new Date(minDate)
    tmpDate.setHours(hour)
    tmpDate.setMinutes(minute)

    const tmpMaxDate = timeUtils.toMonthEnd(maxDate, holidays)
    tmpMaxDate.setHours(hour)
    tmpMaxDate.setMinutes(minute)

    while (tmpDate <= tmpMaxDate) {
      tmpDate = timeUtils.toQuarterEnd(tmpDate, holidays)

      timeTicks.push(tmpDate)
      tmpDate = new Date(tmpDate.getFullYear(), tmpDate.getMonth() + 3, 1, hour, minute)
    }

    return timeTicks
  }
}

const tickX = new TickX()
export default tickX
