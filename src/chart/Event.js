import { EventType } from '../config/Constant'

class Event {
  initEvent () {
    this._mouseWidthDown = false
    this.offsetX = 0
    this.x = 0

    this.chartContainer.addEventListener('mouseenter', this.mouseEnterHandler.bind(this))
    this.chartContainer.addEventListener('mousedown', this.mouseDownHandler.bind(this))
    this.chartContainer.addEventListener('mousemove', this.mouseMoveHandler.bind(this), true)
    this.chartContainer.addEventListener('mouseleave', this.mouseLeaveHandler.bind(this))
    this.chartContainer.addEventListener('touchmove', this.touchMoveHandler.bind(this))
  }

  mouseEnterHandler (event) {
    const eventValue = this.getEventValue(event)
    this.moveStartPosition = {
      x: event.offsetX,
      y: event.offsetY
    }
    this.subscribe(EventType.MOUSE_ENTER, eventValue)
  }

  mouseDownHandler (event) {
    console.warn('mouse down')
    this._mouseWidthDown = true
    this.startScrollPoint = {
      x: event.offsetX,
      y: event.offsetY
    }

    this.subscribe(EventType.MOUSE_DOWN, null)

    const mouseMoveWidthDownHandler = this.mouseMoveWidthDownHandler.bind(this)
    const mouseUpHandler = this.mouseUpHandler.bind(this)
    const mouseLeaveWidthDownHandler = this.mouseLeaveWidthDownHandler.bind(this)
    this.unsubscribeEvent = () => {
      this.chartContainer.removeEventListener('mouseup', mouseUpHandler)
      this.chartContainer.removeEventListener('mouseleave', mouseLeaveWidthDownHandler)
      this.chartContainer.removeEventListener('mousemove', mouseMoveWidthDownHandler)
    }
    this.chartContainer.addEventListener('mouseup', mouseUpHandler)
    this.chartContainer.addEventListener('mouseleave', mouseLeaveWidthDownHandler)
    this.chartContainer.addEventListener('mousemove', mouseMoveWidthDownHandler)
  }

  mouseUpHandler (event) {
    this._mouseWidthDown = false
    this.unsubscribeEvent()
    this.x += this.offsetX

    if (this.x < this.minOffsetX) this.x = this.minOffsetX
    if (this.x > this.maxOffsetX) this.x = this.maxOffsetX
  }

  mouseLeaveWidthDownHandler (event) {
    this._mouseWidthDown = false
    this.unsubscribeEvent()
    this.x += this.offsetX

    if (this.x < this.minOffsetX) this.x = this.minOffsetX
    if (this.x > this.maxOffsetX) this.x = this.maxOffsetX
  }

  mouseMoveHandler (event) {
    if (this._mouseWidthDown) return
    console.warn('mouse move')

    const eventValue = this.getEventValue(event)
    this.subscribe(EventType.MOUSE_MOVE, eventValue)
  }

  mouseMoveWidthDownHandler (event) {
    if (!this._mouseWidthDown) return
    console.warn('move with mouse down')
    const offsetX = event.offsetX - this.startScrollPoint.x
    const x = this.x + offsetX

    const minOffsetX = 0
    const maxOffsetX = this.renderTimeSeries.prices.length * this.config.style.tickWidth - this.config.chartWidth
    this.minOffsetX = minOffsetX
    this.maxOffsetX = maxOffsetX

    if (x < this.minOffsetX || x > this.maxOffsetX) return

    this.offsetX = offsetX

    this.updateData(x).then(d => {
      this.components.forEach(c => {
        try {
          c.update(x)
        } catch (e) {
          console.error(e)
        }
      })
    })
  }

  mouseLeaveHandler (event) {
    this._mouseWidthDown = false
    this.subscribe(EventType.MOUSE_LEAVE, null)
  }

  touchStartHandler (event) {
    this.subscribe(EventType.TOUCH_START, null)
  }

  touchMoveHandler (event) {

  }

  touchEndHandler (event) {

  }

  getEventValue (event) {
    let val = null
    let hoverDate = null

    val = {
      event,
      x: event.offsetX,
      y: event.offsetY
    }

    if (this.scalePoints) {
      hoverDate = this.scaleReverse(val.x - parseInt(this.x, 10))
    }
    val.hoverDate = hoverDate
    return val
  }

  scaleReverse (position) {
    let val = null
    const { domain, scalePoints } = this
    const { tickWidth } = this.config.style

    const index = scalePoints.findIndex(p => {
      return position >= p - tickWidth / 2 && position <= p + tickWidth / 2
    })
    val = domain[index]
    return val
  }

  subscribe (eventType, value) {
    if (!this.components) return

    for (const c of this.components) {
      try {
        c.receiveEvent(eventType, value)
      } catch (e) {
        console.error('error:', e)
      }
    }
  }
}

export default Event
