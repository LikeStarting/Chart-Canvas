import Base from './Base'
import tickX from '../scale/TickX'
import tickY from '../scale/TickY'
import scaleY from '../scale/ScaleY'

class Grid extends Base {
  constructor (data, config) {
    super(data, config)

    this.transfrom = { x: 0, y: 0 }
  }

  updateData () {
    const d = this.renderTimeSeries

    const [minDate, maxDate] = this.data.getDateRange(d.prices)
    this.minDate = minDate
    this.maxDate = maxDate

    if (this.config.vertical.display) {
      const { interval } = this.config.vertical
      const { marketTime, holidays, periodicity } = this.data
      this.vTicks = tickX.getTicks(new Date(minDate), new Date(maxDate), interval, marketTime, holidays, periodicity)
    }
    const { yScale, minVal, maxVal } = scaleY.createScale(
      this.config.yScale,
      d,
      this.config.coordinate.top,
      this.config.coordinate.bottom
    )
    this.yScale = yScale
    this.minVal = minVal
    this.maxVal = maxVal

    if (this.config.horizontal.display) {
      this.hTicks = this.genHorizontalTicks()
    }
  }

  genHorizontalTicks () {
    let hTicks = []
    let count = Math.ceil(this.config.position.height / this.config.horizontal.interval)

    if (this.config.yScale.type === 'pow') {
      count += 6
    } else if (this.config.yScale.type === 'log') {
      count *= 6
    } else if (this.config.yScale.type === 'linear') {
      count += 2
    }

    hTicks = tickY.getTicks(this.minVal, this.maxVal, count)

    hTicks.sort((a, b) => (parseFloat(a) > parseFloat(b) ? -1 : 1))
    const minInterval = this.config.horizontal.labelSize * 1.5

    let adjTicks = []
    if (hTicks) {
      for (let i = 0; i < hTicks.length; i += 1) {
        const tick = hTicks[i]
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

  getVerticalPoints (vTicks) {
    const { xScale, transfrom } = this
    const verticalPoints = []

    const { top, bottom } = this.config.coordinate
    const correct = (this.config.vertical.lineWidth % 2 === 0) ? 0 : 0.5

    vTicks.forEach(date => {
      const x = xScale(date) + correct + transfrom.x
      verticalPoints.push({
        start: { x, y: top },
        end: { x, y: bottom }
      })
    })
    return verticalPoints
  }

  getHorizontalPoints (hTicks) {
    const { yScale } = this
    const horizontalPoints = []

    const { left, right } = this.config.coordinate
    const correct = (this.config.horizontal.lineWidth % 2 === 0) ? 0 : 0.5

    hTicks.forEach(tick => {
      const y = this.config.height - yScale(tick) + correct
      horizontalPoints.push({
        start: { x: left, y },
        end: { x: right, y }
      })
    })
    return horizontalPoints
  }

  drawHorizontalLine (points) {
    for (const p of points) {
      this.drawLine(p.start, p.end)
    }
  }

  drawVerticalLine (points) {
    for (const p of points) {
      this.drawLine(p.start, p.end)
    }
  }

  setLineStyle (ctx, style) {
    ctx.strokeStyle = style.lineColor
    ctx.lineWidth = style.lineWidth
    if (style.dashArray) ctx.setLineDash(style.dashArray)
  }

  receiveEvent (type, value) {

  }

  draw () {
    this.initContainer()
    this.initCanvas()

    this.updateData()

    this.ctx.save()

    this.drawBorder()

    if (this.config.horizontal.display) {
      this.setLineStyle(this.ctx, this.config.horizontal)
      this.drawHorizontalLine(this.getHorizontalPoints(this.hTicks))
    }

    if (this.config.vertical.display) {
      this.setLineStyle(this.ctx, this.config.vertical)
      this.drawVerticalLine(this.getVerticalPoints(this.vTicks))
    }

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

    if (this.config.horizontal.display) {
      this.setLineStyle(this.ctx, this.config.horizontal)
      this.drawHorizontalLine(this.getHorizontalPoints(this.hTicks))
    }

    if (this.config.vertical.display) {
      this.setLineStyle(this.ctx, this.config.vertical)
      this.drawVerticalLine(this.getVerticalPoints(this.vTicks))
    }

    this.ctx.restore()
  }
}

export default Grid
