class DataConfig {
  constructor (data) {
    this._data = data
  }

  getDateRange (prices) {
    return [prices[0].date, prices[prices.length - 1].date]
  }
}

export default DataConfig
