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

  genTextPoints (xTicks) {
    const { xScale } = this
    const { lineWidth, tickLineWidth, textPadding, textAlign, textVerticalAlign } = this.config.style
    const [top, right, bottom, left] = textPadding

    const textPoints = xTicks.map((tick, i) => {
      let x = xScale(tick) + left + tickLineWidth
      if (xTicks[i + 1] && textAlign === 'center') {
        const nextX = xScale(xTicks[i + 1]) - right
        x = x + (nextX - x) / 2
      }
      if (xTicks[i + 1] && textAlign === 'right') {
        x = xScale(xTicks[i + 1]) - right
      }

      let y = this.config.coordinate.top + top + lineWidth
      if (textVerticalAlign === 'middle') {
        const height = this.config.position.height
        y = y + (height + lineWidth - y) / 2
      }
      if (textVerticalAlign === 'bottom') {
        const height = this.config.position.height
        y = height - bottom
      }

      return { x, y, date: tick }
    })
    return textPoints
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

  drawText (xTicks) {
    const { textSize, textWeight, textFamily, textColor, textAlign, textVerticalAlign } = this.config.style

    this.ctx.font = `${textSize}px ${textWeight} ${textFamily}`
    this.ctx.fillStyle = textColor
    this.ctx.textAlign = textAlign
    this.ctx.textBaseline = textVerticalAlign

    const format = (d) => `${d.getMonth() + 1}-${d.getFullYear() % 100}`

    xTicks.forEach((tick, i) => {
      if (!xTicks[i + 1] && (textAlign === 'center' || textAlign === 'right')) {
        this.ctx.textAlign = 'left'
      }
      this.ctx.fillText(format(tick.date), tick.x, tick.y)
    })
  }

  // genYTicks () {

  // }

  draw () {
    this.initContainer()
    this.initCanvas()

    this.updateData()

    this.ctx.save()

    this.drawBorder()

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
    this.drawText(this.genTextPoints(this.xTicks))

    this.ctx.restore()
  }

  update () {

  }
}
