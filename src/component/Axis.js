import Base from './Base'

import tickX from '../scale/TickX'
import tickY from '../scale/TickY'
import scaleY from '../scale/ScaleY'
import { formatNum } from '../utils/format'

export default class Axis extends Base {
  constructor (data, config) {
    super(data, config)

    this.transform = { x: 0, y: 0 }
  }

  updateData () {
    const d = this.renderTimeSeries

    const [minDate, maxDate] = this.data.getDateRange(d.prices)
    this.minDate = minDate
    this.maxDate = maxDate

    if (this.config.locate === 'top' || this.config.locate === 'bottom') {
      this.xTicks = this.genXTicks(minDate, maxDate)
    }

    if (this.config.locate === 'left' || this.config.locate === 'right') {
      const { yScale, minVal, maxVal } = scaleY.createScale(
        this.config.yScale,
        d,
        this.config.coordinate.top,
        this.config.coordinate.bottom
      )
      this.yScale = yScale
      this.minVal = minVal
      this.maxVal = maxVal
      this.yTicks = this.genYTicks()
    }
  }

  genXTicks (minDate, maxDate) {
    let xTicks = []
    const { marketTime, holidays, periodicity } = this.data
    if (this.config.tickIntervalX) {
      xTicks = tickX.getTicks(new Date(minDate), new Date(maxDate), this.config.tickIntervalX, marketTime, holidays, periodicity)
    }

    return xTicks
  }

  genYTicks () {
    let yTicks = []
    let count = Math.ceil(this.config.position.height / this.config.tickIntervalY)

    if (this.config.yScale.type === 'pow') {
      count += 6
    } else if (this.config.yScale.type === 'log') {
      count *= 6
    } else if (this.config.yScale.type === 'linear') {
      count += 2
    }

    yTicks = tickY.getTicks(this.minVal, this.maxVal, count)

    return yTicks
  }

  genXPoints (xTicks) {
    const { xScale, transform } = this
    const xPoints = []
    const { tickLineWidth, tickLineLength } = this.config.style
    const correct = (tickLineWidth % 2 === 0) ? 0 : 0.5
    xTicks.forEach(tick => {
      const x = xScale(tick) + correct + transform.x
      xPoints.push({
        start: { x, y: 0 },
        end: { x, y: tickLineLength }
      })
    })
    return xPoints
  }

  genYPoints (yTicks) {
    const { yScale } = this
    const yPoints = []
    const { tickLineWidth, tickLineLength } = this.config.style
    const correct = (tickLineWidth % 2 === 0) ? 0 : 0.5

    yTicks.forEach(tick => {
      const y = this.config.height - yScale(tick) + correct
      yPoints.push({
        start: { x: 0, y },
        end: { x: tickLineLength, y }
      })
    })
    return yPoints
  }

  genTextPoints (xTicks) {
    const { xScale, transform } = this
    const { lineWidth, tickLineWidth, textPadding, textAlign, textVerticalAlign } = this.config.style
    const [top, right, bottom, left] = textPadding
    const correct = (tickLineWidth % 2 === 0) ? 0 : 0.5

    const textPoints = xTicks.map((tick, i) => {
      let x = xScale(tick) + left + tickLineWidth + correct + transform.x
      if (xTicks[i + 1] && textAlign === 'center') {
        const nextX = xScale(xTicks[i + 1]) - right + correct
        x = x + (nextX - x) / 2
      }
      if (xTicks[i + 1] && textAlign === 'right') {
        x = xScale(xTicks[i + 1]) - right + correct
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

  genYTextPoints (yTicks) {
    const { yScale } = this
    const { tickLineWidth, tickLineLength } = this.config.style
    const correct = tickLineWidth % 2 === 0 ? 0 : 0.5
    const textPoints = yTicks.map((tick, i) => {
      const x = tickLineLength + 2
      const y = this.config.height - yScale(tick) + correct

      return { x, y, v: formatNum(tick) }
    })

    return textPoints
  }

  drawXLine () {
    this.ctx.strokeStyle = this.config.style.lineColor
    this.ctx.lineWidth = this.config.style.lineWidth

    const correct = (this.ctx.lineWidth % 2) ? 0.5 : 0
    const start = {
      x: 0,
      y: 0 + correct
    }
    const end = {
      x: this.config.coordinate.right,
      y: 0 + correct
    }

    this.drawLine(start, end)
  }

  drawYLine () {
    this.ctx.strokeStyle = this.config.style.lineColor
    this.ctx.lineWidth = this.config.style.lineWidth

    const correct = (this.ctx.lineWidth % 2) ? 0.5 : 0
    const start = {
      x: 0 + correct,
      y: 0
    }
    const end = {
      x: 0 + correct,
      y: this.config.coordinate.bottom
    }

    this.drawLine(start, end)
  }

  drawTicks (ticks) {
    this.ctx.strokeStyle = this.config.style.tickLineColor
    this.ctx.lineWidth = this.config.style.tickLineWidth

    ticks.forEach(tick => {
      this.drawLine(tick.start, tick.end)
    })
  }

  drawText (xTicks) {
    const { textSize, textWeight, textFamily, textColor, textAlign, textVerticalAlign } = this.config.style

    this.ctx.font = `${textSize}px ${textWeight} ${textFamily}`
    this.ctx.fillStyle = textColor
    this.ctx.textAlign = textAlign
    this.ctx.textBaseline = textVerticalAlign

    const format = (d) => {
      const month = d.getMonth() > 10 ? 1 : d.getMonth() + 1
      const year = d.getMonth() > 10 ? d.getFullYear() + 1 : d.getFullYear()
      return `${month}/${year}`
    }

    xTicks.forEach((tick, i) => {
      if (!xTicks[i + 1] && (textAlign === 'center' || textAlign === 'right')) {
        this.ctx.textAlign = 'left'
      }
      this.ctx.fillText(format(tick.date), tick.x, tick.y)
    })
  }

  drawYText (yTicks) {
    const { textSize, textWeight, textFamily, textColor } = this.config.style
    const { bottom } = this.config.coordinate

    this.ctx.font = `${textSize}px ${textWeight} ${textFamily}`
    this.ctx.fillStyle = textColor
    this.ctx.textBaseline = 'middle'

    yTicks.forEach((tick, i) => {
      if (tick.y < textSize || tick.y > bottom - textSize) return

      this.ctx.fillText(tick.v, tick.x, tick.y)
    })
  }

  draw () {
    this.initContainer()
    this.initCanvas()

    this.updateData()

    this.ctx.save()

    this.drawBorder()

    if (this.config.locate === 'top' || this.config.locate === 'bottom') {
      this.drawXLine()
      this.drawTicks(this.genXPoints(this.xTicks))
      this.drawText(this.genTextPoints(this.xTicks))
    }

    if (this.config.locate === 'left' || this.config.locate === 'right') {
      this.drawYLine()
      this.drawTicks(this.genYPoints(this.yTicks))
      this.drawYText(this.genYTextPoints(this.yTicks))
    }

    this.ctx.restore()
  }

  update (offsetX) {
    this.transform.x = offsetX

    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)

    this.updateData()
    this.ctx.save()

    this.drawBorder()

    if (this.config.locate === 'top' || this.config.locate === 'bottom') {
      this.drawXLine()
      this.drawTicks(this.genXPoints(this.xTicks))
      this.drawText(this.genTextPoints(this.xTicks))
    }

    if (this.config.locate === 'left' || this.config.locate === 'right') {
      this.drawYLine()
      this.drawTicks(this.genYPoints(this.yTicks))
      this.drawYText(this.genYTextPoints(this.yTicks))
    }

    this.ctx.restore()
  }
}
