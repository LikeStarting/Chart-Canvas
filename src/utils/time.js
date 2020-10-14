class TimeUtils {
  getTradeCloseTime (tradeTime) {
    const { hour, minute } = tradeTime[tradeTime.length - 1][1]
    return {
      hour,
      minute
    }
  }

  getQuarter (date) {
    const quarter = ~~(date.getMonth() / 3) + 1
    const lastMonth = quarter * 3 - 1
    return { quarter, lastMonth }
  }

  isTradingDay (date, holidays) {
    if (date.getDay() === 0 || date.getDay() === 6) return false

    let tmpDate = date
    if (date.getHours() || date.getMinutes() || date.getSeconds()) {
      tmpDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }

    return !holidays.map(Number).some(d => d === tmpDate.getTime())
  }

  toFriday (date, holidays) {
    if (!holidays) return this.toWeekday(date, 5)

    for (let d = 5; d >= 1; d--) {
      const day = this.toWeekday(date, d)
      if (this.isTradingDay(day, holidays)) return day
    }

    return this.toWeekday(date, 5)
  }

  toWeekday (date, n) {
    const tmp = new Date(date)

    if (tmp.getDay() !== n) {
      tmp.setDate(n - tmp.getDay() + tmp.getDate())
    }

    return tmp
  }

  toMonthEnd (date, holidays) {
    const tmp = new Date(date)

    tmp.setMonth(tmp.getMonth() + 1)
    tmp.setDate(0)

    while (!this.isTradingDay(tmp, holidays)) {
      tmp.setDate(tmp.getDate() - 1)
    }

    return tmp
  }

  toQuarterEnd (date, holidays) {
    const { lastMonth } = this.getQuarter(date)

    const tmp = new Date(date.getFullYear(), lastMonth, 1, date.getHours(), date.getMinutes())

    return this.toMonthEnd(tmp, holidays)
  }
}

const timeUtils = new TimeUtils()

export default timeUtils
