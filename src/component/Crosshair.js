import Base from './Base'
import { EventType } from '../config/Constant'

class Crosshair extends Base {
  constructor (data, config) {
    super(data, config)

    this.pos = {
      x: 0,
      y: 0
    }
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
    // this.chart.chartContainer.style.cursor = 'pointer'
  }

  onMouseMove (value) {
    const { hoverDate, x, y } = value
    const isShow = this.checkMouseMove(x, y)
    if (!isShow) {
      this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
      return
    }

    const { prices } = this.renderTimeSeries
    if (hoverDate) {
      const price = prices.find(p => p.date.valueOf() === hoverDate.valueOf())
      // console.log('---', price, hoverDate)
    }

    this.chart.chartContainer.style.cursor = 'crosshair'
    this.updatePosition(value)
    this.updateCrosshair()
  }

  onMouseLeave () {
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
  }

  checkMouseMove (x, y) {
    const { left, right, top, bottom } = this.config.coordinate

    if (x <= left || x >= right) return false
    if (y <= top || y >= bottom) return false

    return true
  }

  updatePosition (pos) {
    this.pos.x = pos.x
    this.pos.y = pos.y
  }

  getLinePoints (pos) {
    return [
      {
        start: { x: this.config.coordinate.left, y: pos.y },
        end: { x: this.config.coordinate.right, y: pos.y }
      },
      {
        start: { x: pos.x, y: this.config.coordinate.top },
        end: { x: pos.x, y: this.config.coordinate.bottom }
      }
    ]
  }

  drawCrosshair (pos) {
    const { lineColor, lineWidth, dashArray } = this.config.style
    this.ctx.strokeStyle = lineColor
    this.ctx.lineWidth = lineWidth
    this.ctx.setLineDash(dashArray)

    const points = this.getLinePoints(pos)

    for (const p of points) {
      this.drawLine(p.start, p.end)
    }
  }

  updateCrosshair () {
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    this.ctx.save()

    this.drawCrosshair(this.pos)

    this.ctx.restore()
  }

  draw () {
    this.initContainer()
    this.initCanvas()

    this.ctx.save()

    this.drawCrosshair(this.pos)

    this.ctx.restore()
  }

  update () {
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    this.chart.chartContainer.style.cursor = 'pointer'
  }
}

export default Crosshair
