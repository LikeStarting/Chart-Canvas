import Base from './Base'
import scaleY from '../scale/ScaleY'
import scaleX from '../scale/ScaleX'

class Bar extends Base {
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

    const { lineWidth } = this.config.style
    const correct = (lineWidth % 2) === 0 ? 0 : 0.5

    bars.forEach(bar => {
      pointBars.push({
        x: xScale(bar.date) + correct - lineWidth / 2 + transfrom.x,
        y: this.config.height - yScale(bar.volume)
      })
    })

    return pointBars
  }

  drawBars (bars, color) {
    const { bottom } = this.config.coordinate

    this.ctx.fillStyle = color
    for (const bar of bars) {
      const height = bottom - bar.y
      this.ctx.fillRect(bar.x, bar.y, this.config.style.lineWidth, height)
    }
  }

  draw () {
    this.initContainer()
    this.initCanvas()

    this.updateData()

    this.ctx.save()

    this.drawBorder()

    this.drawBars(this.genBars(this.upBars), this.config.style.upColor)
    this.drawBars(this.genBars(this.downBars), this.config.style.downColor)

    this.ctx.restore()
  }

  update (offsetX) {
    this.transfrom.x = offsetX
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    this.updateData()

    this.ctx.save()

    this.drawBorder()

    this.drawBars(this.genBars(this.upBars), this.config.style.upColor)
    this.drawBars(this.genBars(this.downBars), this.config.style.downColor)

    this.ctx.restore()
  }
}

export default Bar
