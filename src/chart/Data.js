import DataConfig from '../data'

class Data {
  get data () {
    return this._data
  }

  set data (data) {
    this._data = new DataConfig(data)
  }
}

export default Data
