class TimeUtils {
  getTradeCloseTime (tradeTime) {
    const { hour, minte } = tradeTime[tradeTime.length - 1][1]
    return {
      hour,
      minte
    }
  }

  isTradingDay (date, holidays) {
    if (date.getDay() === 0 || date.getDay() === 6) return false

    let tmpDate = date
    if (date.getHours() || date.getMintes() || date.getSecends()) {
      tmpDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }

    return holidays.map(Number).some(d => d === tmpDate.getTime())
  }
}

const timeUtils = new TimeUtils()

export default timeUtils
