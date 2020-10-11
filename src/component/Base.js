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

  initContainer () {
    this.componentContainer = document.createElement('div')
    this.componentContainer.id = this.config.id
    this.componentContainer.userSelect = 'none'
    this.componentContainer.style.position = 'absolute'
    this.componentContainer.style.top = this.config.position.top + 'px'
    this.componentContainer.style.left = this.config.position.left + 'px'
    this.componentContainer.style.width = this.config.position.width
    this.componentContainer.style.height = this.config.position.height + 'px'
    this.chart.chartContainer.appendChild(this.componentContainer)
  }

  initCanvas () {
    this.canvas = document.createElement('canvas')
    this.canvas.style.position = 'absolute'
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.top = 0
    this.canvas.style.left = 0
    this.ctx = this.canvas.getContext('2d')
    this.componentContainer.appendChild(this.canvas)
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
