export default class Base {
  constructor (config, data) {
    this.config = config
    this.data = data
    this._initCanvas(config)
    this._drawGrid()
  }

  get xScale () {
    return this.chart.xScale
  }

  _initCanvas (container) {
    this._canvas = document.createElement('canvas')
    this._canvas.style.position = 'absolute'
    this._ctx = this._canvas.getContext('2d')
    container.appendChild(this._canvas)
  }

  redraw (callback) {
    if (callback) {
      callback()
    }
    this.draw()
  }

  draw () {

  }
}
