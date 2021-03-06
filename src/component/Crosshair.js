import Base from './Base'
import { EventType } from '../config/Constant'

class Crosshair extends Base {
  constructor (data, config) {
    super(data, config)

    this.pos = {
      x: 0,
      y: 0
    }
    this.transform = {
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
    this.chart.chartContainer.style.cursor = 'pointer'
    this.tooltipNode.style.visibility = 'hidden'
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
  }

  onMouseMove (value) {
    const { hoverDate, x, y } = value

    const isShow = this.checkMouseMove(x, y)
    if (!isShow) {
      this.tooltipNode.style.visibility = 'hidden'
      this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
      return
    }
    console.log('hoverDate=====', hoverDate)
    if (!hoverDate) return
    this.chart.chartContainer.style.cursor = 'crosshair'
    const adjustValue = this.xScale(hoverDate) + this.transform.x
    this.updatePosition({
      x: adjustValue,
      y
    })

    this.updateCrosshair()

    const { prices } = this.renderTimeSeries
    const price = prices.find(p => p.date.valueOf() === hoverDate.valueOf())

    if (price && price.close) {
      const tooltip = this.config.tooltip({ chart: this.chart, price })
      this.updateTooltip(tooltip, {
        x: adjustValue,
        y
      })
    } else {
      this.tooltipNode.style.visibility = 'hidden'
    }
  }

  onMouseLeave () {
    this.tooltipNode.style.visibility = 'hidden'
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
    const correct = this.ctx.lineWidth % 2 === 0 ? 0 : 0.5
    return [
      {
        start: { x: this.config.coordinate.left, y: pos.y + correct },
        end: { x: this.config.coordinate.right, y: pos.y + correct }
      },
      {
        start: { x: pos.x + correct, y: this.config.coordinate.top },
        end: { x: pos.x + correct, y: this.config.coordinate.bottom }
      }
    ]
  }

  drawCrosshair (pos) {
    const { lineColor, lineWidth, dashArray } = this.config.style
    this.ctx.strokeStyle = lineColor
    this.ctx.lineWidth = lineWidth
    if (dashArray) {
      this.ctx.setLineDash(dashArray)
    }

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

  drawTooltip () {
    const node = document.createElement('div')
    node.id = 'tooltip_wrapper'
    node.style.position = 'absolute'
    node.style.left = 0
    node.style.top = 0
    node.style.opacity = this.config.style.tooltipOpacity
    this.tooltipNode = node
    this.componentContainer.appendChild(node)
  }

  updateTooltip (html, position) {
    this.tooltipNode.style.visibility = 'visible'
    this.tooltipNode.innerHTML = html

    const element = document.getElementById(this.tooltipNode.id)
    const width = element.offsetWidth
    const height = element.offsetHeight

    let x = position.x
    let y = position.y
    const { top, right, bottom, left } = this.config.coordinate
    const { tooltipOffsetX, tooltipOffsetY } = this.config.style
    const boundary = {
      top,
      right,
      bottom,
      left
    }

    if (y + tooltipOffsetY + height > boundary.bottom) {
      y = y - tooltipOffsetY - height
    } else {
      y = y + tooltipOffsetY
    }

    if (x + tooltipOffsetX + width > boundary.right) {
      x = x - tooltipOffsetX - width
    } else {
      x = x + tooltipOffsetX
    }

    this.tooltipNode.style.left = x + 'px'
    this.tooltipNode.style.top = y + 'px'
  }

  draw () {
    this.initContainer()
    this.initCanvas()

    this.drawTooltip()
  }

  update (offsetX) {
    if (offsetX !== undefined) {
      this.transform.x = offsetX
    }
    console.log('-----', offsetX)
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight)
    this.chart.chartContainer.style.cursor = 'pointer'
  }
}

export default Crosshair
