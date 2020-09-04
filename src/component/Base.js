import tickX from '../scale/TickX'

export default class Base {
  constructor (config, data) {
    this.data = data
    this._initCanvas(config)
    this._drawGrid()
  }

  _initCanvas (container) {
    this._canvas = document.createElement('canvas')
    this._canvas.style.position = 'absolute'
    this._ctx = this._canvas.getContext('2d')
    container.appendChild(this._canvas)
  }

  updateTicks () {
    const d = this.chart.timeSeries
    const [minDate, maxDate] = this.data.getDateRange(d.prices)
    if (this.config.vertical.display) {
      const { interval } = this.config.vertical
      const { tradeTime, holidays, periodicity } = this.data
      this.vTicks = tickX.getTicks(minDate, maxDate, interval, tradeTime, holidays, periodicity)
    }

    if (this.config.horizontal.display) {
      // this.hTicks = tickY
    }
  }

  _redraw (callback) {
    if (callback) {
      callback()
    }
    this._draw()
  }

  _draw () {

  }

  _drawGrid () {
    const { grid } = this.config
    if (!grid) return

    this._ctx.save()

    if (grid.horizontal.display) {
      this.createHorizontalGrid(grid.horizontal)
    }

    if (grid.vertical.display) {
      this.createVerticalGrid(grid.vertical)
    }

    this._ctx.restore()
  }

  createVerticalGrid (style) {
    this._setLineStyle(this._ctx, style)
    this.vTicks.forEach(t => {
      this._drawHorizontalLine(this._ctx, t.x, 0, this.config.height)
    })
  }

  createHorizontalGrid (style) {
    this._setLineStyle(this._ctx, style)
    this.ticks.forEach(t => {
      this._drawHorizontalLine(this._ctx, t.y, 0, this.config.width)
    })
  }

  _setLineStyle (ctx, style) {
    ctx.strokeStyle = style.color
    ctx.lineWidth = style.width
    if (style.dashArray) ctx.setLineDash = style.dashArray
  }

  _drawHorizontalLine (ctx, y, left, right) {
    const correct = (ctx.lineWidth % 2) ? 0.5 : 0
    ctx.beginPath()
    ctx.moveTo(left, y + correct)
    ctx.lineTo(right, y + correct)
    ctx.stroke()
    ctx.closePath()
  }

  _drawVerticalLine (ctx, x, top, bottom) {
    const correct = (ctx.lineWidth % 2) ? 0.5 : 0
    ctx.beginPath()
    ctx.moveTo(x + correct, top)
    ctx.lineTo(x + correct, bottom)
    ctx.stroke()
    ctx.closePath()
  }
}
