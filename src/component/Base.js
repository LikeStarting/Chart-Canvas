export default class Base {
  constructor (data, config) {
    this.config = config
    this.data = data
  }

  get root () {
    return this.chart.config.root
  }

  get xScale () {
    return this.chart.xScale
  }

  initCanvas () {
    this.canvas = document.createElement('canvas')
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = this.config.top
    this.canvas.style.left = this.config.left
    this.ctx = this.canvas.getContext('2d')
    this.chart.container.appendChild(this.canvas)
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
