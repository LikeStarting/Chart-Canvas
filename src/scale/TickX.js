import timeUtils from '../utils/time'

class TickX {
  getTicks (minDate, maxDate, interval, tradeTime, holidays, periodicity) {
    let timeTicks = []

    switch (interval) {
      case 'd1':
        timeTicks = this.daily(minDate, maxDate, tradeTime, holidays, 1)
        break
      case 'd2':
        timeTicks = this.daily(minDate, maxDate, tradeTime, holidays, 2)
        break
    }

    return timeTicks
  }

  daily (minDate, maxDate, tradeTime, holidays, interval) {
    const timeTicks = []
    const { hour, minte } = timeUtils.getTradeCloseTime(tradeTime)
    const tmpDate = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate(),
      hour,
      minte
    )

    // eslint-disable-next-line no-unmodified-loop-condition
    while (tmpDate <= maxDate) {
      if (timeUtils.isTradingDay(tmpDate, holidays)) {
        timeTicks.push(tmpDate)
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
}

const tickX = new TickX()
export default tickX
