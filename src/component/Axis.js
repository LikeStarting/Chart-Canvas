import Base from './Base'

import tickX from '../scale/TickX'

export default class Axis extends Base {
  updateData () {
    const d = this.renderTimeSeries

    const [minDate, maxDate] = this.data.getDateRange(d.prices)
    this.minDate = minDate
    this.maxDate = maxDate

    if (this.config.locate === 'top' || this.config.locate === 'bottom') {
      this.xTicks = this.genXTicks(minDate, maxDate)
    }

    // if (this.config.locate === 'left' || this.config.locate === 'right') {
    //   this.yTicks = this.genYTicks()
    // }
  }

  genXTicks (minDate, maxDate) {
    let xTicks = []
    const { marketTime, holidays, periodicity } = this.data
    if (this.config.tickIntervalX) {
      xTicks = tickX.getTicks(new Date(minDate), new Date(maxDate), this.config.tickIntervalX, marketTime, holidays, periodicity)
    }

    return xTicks
  }

  genXPoints (xTicks) {
    const { xScale } = this
    const xPoints = []
    xTicks.forEach(tick => {
      xPoints.push({
        x: xScale(tick)
      })
    })
    return xPoints
  }

  drawLine (start, end) {
    this.ctx.strokeStyle = this.config.style.lineColor
    this.ctx.lineWidth = this.config.style.lineWidth

    const correct = (this.ctx.lineWidth % 2) ? 0.5 : 0
    this.ctx.beginPath()
    this.ctx.moveTo(start.x, start.y + correct)
    this.ctx.lineTo(end.x, end.y + correct)
    this.ctx.stroke()
    this.ctx.closePath()
  }

  drawTicks (xTicks) {
    this.ctx.strokeStyle = this.config.style.tickLineColor
    this.ctx.lineWidth = this.config.style.tickLineWidth

    const correct = (this.ctx.lineWidth % 2) ? 0.5 : 0

    xTicks.forEach(tick => {
      this.ctx.beginPath()
      this.ctx.moveTo(tick.x + correct, 0)
      this.ctx.lineTo(tick.x + correct, this.config.style.tickLineLength)
      this.ctx.stroke()
      this.ctx.closePath()
    })
  }

  // genYTicks () {

  // }

  draw () {
    this.initContainer()
    this.initCanvas()

    this.updateData()

    this.ctx.save()

    const startPoints = {
      x: 0,
      y: 0
    }
    const endPoints = {
      x: this.config.coordinate.right,
      y: 0
    }
    this.drawLine(startPoints, endPoints)
    this.drawTicks(this.genXPoints(this.xTicks))

    this.ctx.restore()
  }

  update () {

  }
}
