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

  get renderTimeSeries () {
    return this.chart.renderTimeSeries
  }

  initContainer () {
    this.componentContainer = document.createElement('div')
    this.componentContainer.id = this.config.id
    this.componentContainer.userSelect = 'none'
    this.componentContainer.style.position = 'absolute'
    this.componentContainer.style.top = this.config.position.top + 'px'
    this.componentContainer.style.left = this.config.position.left + 'px'
    this.componentContainer.style.width = this.config.width + 'px'
    this.componentContainer.style.height = this.config.height + 'px'
    this.chart.chartContainer.appendChild(this.componentContainer)
  }

  initCanvas () {
    this.canvas = document.createElement('canvas')
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = 0
    this.canvas.style.left = 0
    this.ctx = this.canvas.getContext('2d')
    this.componentContainer.appendChild(this.canvas)
    this.setCanvasSize()
  }

  setCanvasSize () {
    this.canvas.style.width = this.config.width + 'px'
    this.canvas.style.height = this.config.height + 'px'

    // clientWidth: content + padding
    const pixelRadio = window.devicePixelRatio || 1
    this.canvas.width = this.config.width * pixelRadio
    this.canvas.height = this.config.height * pixelRadio
    this.ctx.scale(pixelRadio, pixelRadio)
  }

  getBorderPoints (orientation) {
    const { top, right, bottom, left } = this.config.coordinate

    let start = {}
    let end = {}
    const correct = this.ctx.lineWidth % 2 === 0 ? 0 : 0.5

    switch (orientation) {
      case 'top':
        start = { x: left, y: top + correct }
        end = { x: right, y: top + correct }
        break
      case 'right':
        start = { x: right + correct, y: top }
        end = { x: right + correct, y: bottom }
        break
      case 'bottom':
        start = { x: left, y: bottom + correct }
        end = { x: right, y: bottom + correct }
        break
      case 'left':
        start = { x: left + correct, y: top }
        end = { x: left + correct, y: bottom }
        break
    }

    return {
      start, end
    }
  }

  drawLine (start, end) {
    this.ctx.beginPath()
    this.ctx.moveTo(start.x, start.y)
    this.ctx.lineTo(end.x, end.y)
    this.ctx.stroke()
    this.ctx.closePath()
  }

  drawBorder () {
    if (!this.config.border || Object.keys(this.config.border).length === 0) return

    for (const [k, v] of Object.entries(this.config.border)) {
      if (v.display) {
        this.ctx.lineWidth = v.lineWidth
        this.ctx.strokeStyle = v.lineColor
        if (v.dashArray) this.ctx.setLineDash(v.dashArray)
        const { start, end } = this.getBorderPoints(k)
        this.drawLine(start, end)
      }
    }
  }

  receiveEvent (type, value) {

  }

  redraw (callback) {
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    if (callback) {
      callback()
    }
    this.draw()
  }

  draw () {

  }
}
