import Base from './Base'

import tickX from '../scale/TickX'
import tickY from '../scale/TickY'
import scaleY from '../scale/ScaleY'
import { formatNum } from '../utils/format'

import { EventType } from '../config/Constant'

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
      const { yScale, yScaleInvert, minVal, maxVal } = scaleY.createScale(
        this.config.yScale,
        d,
        this.config.coordinate.top,
        this.config.coordinate.bottom
      )
      this.yScale = yScale
      this.yScaleInvert = yScaleInvert
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

    yTicks.sort((a, b) => (parseFloat(a) > parseFloat(b) ? -1 : 1))

    const minInterval = this.config.style.textSize * 1.5
    let adjTicks = []

    if (yTicks) {
      for (let i = 0; i < yTicks.length; i += 1) {
        const tick = yTicks[i]
        let toPrevious = null

        if (adjTicks.length === 0) {
          toPrevious = this.config.coordinate.bottom - this.yScale(tick)
        } else {
          toPrevious = this.yScale(adjTicks.slice(-1)[0]) - this.yScale(tick)
        }

        if (toPrevious < minInterval) {
          continue
        }
        adjTicks.push(tick)
      }

      if (adjTicks.length) {
        const toTop = this.yScale(adjTicks.slice(-1)[0]) - this.config.coordinate.top
        if (toTop < minInterval) {
          adjTicks = adjTicks.slice(0, -1)
        }
      }
    }

    return adjTicks
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
      const month = d.getMonth() > 10 ? 0 : d.getMonth() + 1
      const year = d.getMonth() > 10 ? d.getFullYear() + 1 : d.getFullYear()
      return `${month + 1}/${year}`
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

  receiveEvent (type, value) {
    switch (type) {
      case EventType.MOUSE_DOWN:
        this.onMouseDown(value)
        break
      case EventType.MOUSE_MOVE:
        this.onMouseMove(value)
        break
      case EventType.MOUSE_LEAVE:
        this.onMouseLeave()
        break
      default:
        break
    }
  }

  onMouseDown (value) {
    this.update(this.transform.x)
  }

  onMouseMove (value) {
    const { hoverDate, x, y } = value

    if (!this.checkMouseMove(x, y)) {
      this.update(this.transform.x)
      return
    }

    if (!hoverDate) return
    const adjustValue = this.xScale(hoverDate) + this.transform.x

    const { prices } = this.renderTimeSeries
    const price = prices.find(p => p.date.valueOf() === hoverDate.valueOf())

    // if (price && price.close) {
    //   const tooltip = this.config.tooltip({ chart: this.chart, price })
    //   this.updateTooltip(tooltip, {
    //     x: adjustValue,
    //     y
    //   })
    // }
    const correct = this.config.style.tickLineWidth % 2 === 0 ? 0 : 0.5

    const label = {
      x: hoverDate,
      y: this.yScaleInvert && this.yScaleInvert(this.config.position.top + this.config.height - y - correct)
    }

    this.updateLabels(label, {
      x: adjustValue,
      y
    })
  }

  onMouseLeave () {
    this.update(this.transform.x)
  }

  checkMouseMove (x, y) {
    const { left, top } = this.config.position
    const { width, height, locate } = this.config

    let bool = false
    switch (locate) {
      case 'bottom':
        if (x > left && x < left + width && y < top) {
          bool = true
        }
        break
      case 'right':
        if (x < left && y > top && y < top + height) {
          bool = true
        }
        break
    }

    return bool
  }

  drawXLabel (label, x) {
    const { left: axisLeft, right: axisRight } = this.config.coordinate
    const {
      fontSize,
      fontWeight,
      fontFamily,
      fontColor,
      textAlign,
      backgroundColor,
      borderWidth,
      borderColor
    } = this.config.label.vertical
    const [top, right, bottom, left] = this.config.label.vertical.padding

    const format = (d) => {
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const date = d.getDate()
      return `${month.toString().padStart(2, '0')}/${date.toString().padStart(2, '0')}/${year}`
    }

    const text = format(label)
    const textWidth = this.ctx.measureText(text).width
    let labelX = x - textWidth / 2

    if (labelX < axisLeft + left + borderWidth) {
      labelX = axisLeft + left + borderWidth
    } else if (labelX > axisRight - right - borderWidth - textWidth) {
      labelX = axisRight - right - borderWidth - textWidth
    }

    const rectTop = 0
    const rectBottom = fontSize + top + bottom + borderWidth * 2
    const rectLeft = labelX - left - borderWidth
    const rectRight = labelX + textWidth + right + borderWidth

    this.ctx.fillStyle = backgroundColor
    this.ctx.fillRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    if (borderWidth !== 0) {
      this.ctx.lineWidth = borderWidth
      this.ctx.strokeStyle = borderColor
      this.ctx.strokeRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)
    }

    this.ctx.textBaseline = 'top'
    this.ctx.font = `${fontSize}px ${fontWeight} ${fontFamily}`
    this.ctx.fillStyle = fontColor
    this.ctx.textAlign = textAlign
    this.ctx.fillText(text, labelX, borderWidth + top)
  }

  drawYLabel (label, y) {
    const { tickLineLength } = this.config.style
    const { top: axisTop, bottom: axisBottom, left: axisLeft, right: axisRight } = this.config.coordinate
    const {
      fontSize,
      fontWeight,
      fontFamily,
      fontColor,
      textAlign,
      backgroundColor,
      borderWidth,
      borderColor
    } = this.config.label.horizontal
    const [top, right, bottom, left] = this.config.label.horizontal.padding

    const format = (v) => {
      return v < 1000 ? v.toFixed(3) : parseInt(v, 10)
    }

    const text = format(label)
    let labelY = y - fontSize / 2 - this.config.position.top

    if (labelY < axisTop + top + borderWidth) {
      labelY = axisTop + top + borderWidth
    } else if (labelY > axisBottom - bottom - borderWidth - fontSize) {
      labelY = axisBottom - bottom - borderWidth - fontSize
    }

    const rectTop = labelY - top - borderWidth
    const rectBottom = labelY + fontSize + bottom + borderWidth
    const rectLeft = axisLeft
    const rectRight = axisRight

    this.ctx.fillStyle = backgroundColor
    this.ctx.fillRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)

    if (borderWidth !== 0) {
      this.ctx.lineWidth = borderWidth
      this.ctx.strokeStyle = borderColor
      this.ctx.strokeRect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)
    }

    this.ctx.textBaseline = 'top'
    this.ctx.font = `${fontSize}px ${fontWeight} ${fontFamily}`
    this.ctx.fillStyle = fontColor
    this.ctx.textAlign = textAlign
    this.ctx.fillText(text, tickLineLength + 2, labelY)
  }

  updateLabels (label, pos) {
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    this.ctx.save()

    this.drawBorder()
    const { locate } = this.config
    if (locate === 'top' || locate === 'bottom') {
      this.drawXLine()
      this.drawTicks(this.genXPoints(this.xTicks))
      this.drawText(this.genTextPoints(this.xTicks))
      this.drawXLabel(label.x, pos.x)
    }

    if (this.config.locate === 'left' || this.config.locate === 'right') {
      this.drawYLine()
      this.drawTicks(this.genYPoints(this.yTicks))
      this.drawYText(this.genYTextPoints(this.yTicks))
      this.drawYLabel(label.y, pos.y)
    }

    this.ctx.restore()
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
    if (offsetX !== undefined) {
      this.transform.x = offsetX
    }

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
