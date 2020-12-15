import Base from './Base'

import scaleY from '../scale/ScaleY'

class HLC extends Base {
  constructor (data, config) {
    super(data, config)

    this.transfrom = { x: 0, y: 0 }
  }

  updateData () {
    const d = this.renderTimeSeries

    if (this.config.type === 'candlestick') {
      this.upBars = d.prices.filter(p => p.close >= p.open)
      this.downBars = d.prices.filter(p => p.close < p.open)
    } else {
      this.upBars = d.prices.filter(p => p.chg >= 0)
      this.downBars = d.prices.filter(p => p.chg < 0)
    }

    const { yScale } = scaleY.createScale(
      this.config.yScale,
      d,
      this.config.coordinate.top,
      this.config.coordinate.bottom
    )
    this.yScale = yScale
  }

  genBars (bars) {
    const { xScale, yScale, transfrom } = this
    const pointBars = []

    const { lineWidth, tickBarWidth } = this.config.style
    const correct = lineWidth % 2 === 0 ? 0 : 0.5
    bars.forEach(bar => {
      const highLowPoint = {
        x: xScale(bar.date) + correct - lineWidth / 2 + transfrom.x,
        y: this.config.height - yScale(bar.high),
        width: lineWidth,
        height: yScale(bar.high) - yScale(bar.low)
      }
      const closePoint = {
        start: { x: xScale(bar.date) - tickBarWidth / 2 + transfrom.x, y: this.config.height - yScale(bar.close) + correct },
        end: { x: xScale(bar.date) + tickBarWidth / 2 + transfrom.x, y: this.config.height - yScale(bar.close) + correct }
      }
      pointBars.push({
        highLowPoint,
        closePoint
      })
    })

    return pointBars
  }

  drawBars (bars, color) {
    this.ctx.strokeStyle = color
    this.ctx.fillStyle = color

    for (const bar of bars) {
      const { highLowPoint, closePoint } = bar
      this.ctx.fillRect(highLowPoint.x, highLowPoint.y, highLowPoint.width, highLowPoint.height)
      this.drawLine(closePoint.start, closePoint.end)
    }
  }

  draw () {
    this.updateData()

    this.initContainer()
    this.initCanvas()

    this.ctx.save()

    this.drawBorder()

    this.drawBars(this.genBars(this.upBars), this.config.style.upColor)
    this.drawBars(this.genBars(this.downBars), this.config.style.downColor)

    this.ctx.restore()
  }

  update (offsetX) {
    if (offsetX !== undefined) {
      this.transfrom.x = offsetX
    }

    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)

    this.updateData()

    this.ctx.save()

    this.drawBorder()

    this.drawBars(this.genBars(this.upBars), this.config.style.upColor)
    this.drawBars(this.genBars(this.downBars), this.config.style.downColor)

    this.ctx.restore()
  }
}

export default HLC
