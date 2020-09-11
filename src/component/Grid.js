import Base from './Base'
import tickX from '../scale/TickX'

class Grid extends Base {
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

  getVerticalPoints (vTicks) {
    const { xScale } = this
    const verticalPoints = []
    vTicks.forEach(date => {
      verticalPoints.push({
        x: xScale(date)
      })
    })
    return verticalPoints
  }

  getHorizontalPoints (hTicks) {

  }

  drawHorizontalLine (points) {
    const { ctx } = this
    const correct = (ctx.lineWidth % 2) ? 0.5 : 0
    for (const p of points) {
      ctx.beginPath()
      ctx.moveTo(0, p.y + correct)
      ctx.lineTo(this.width, p.y + correct)
      ctx.stroke()
      ctx.closePath()
    }
  }

  drawVerticalLine (points) {
    const { ctx } = this
    const correct = (ctx.lineWidth % 2) ? 0.5 : 0

    for (const p of points) {
      ctx.beginPath()
      ctx.moveTo(p.x + correct, 0)
      ctx.lineTo(p.x + correct, this.height)
      ctx.stroke()
      ctx.closePath()
    }
  }

  setLineStyle (ctx, style) {
    ctx.strokeStyle = style.color
    ctx.lineWidth = style.width
    if (style.dashArray) ctx.setLineDash = style.dashArray
  }

  draw () {
    this.updateTicks()

    this.ctx.save()

    if (this.config.horizontal.display) {
      this.setLineStyle(this.ctx, this.config.horizontal)
      this.drawHorizontalLine(this.getHorizontalPoints)
    }

    if (this.config.vertical.display) {
      this.setLineStyle(this.ctx, this.config.vertical)
      this.drawVerticalLine(this.getVerticalPoints)
    }

    this.ctx.restore()
  }
}

export default Grid
