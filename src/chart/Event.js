import { EventType } from '../config/Constant'

class Event {
  initEvent () {
    this.container.addEventListener('mouseenter', this.mouseEnterHandler.bind(this))
    this.container.addEventListener('mousedown', this.mouseDownHandler.bind(this))
    // this.container.addEventListener('mousemove', this.mouseMoveHandler.bind(this))
    this.container.addEventListener('mouseleave', this.mouseLeaveHandler.bind(this))
    this.container.addEventListener('touchmove', this.touchMoveHandler.bind(this))
  }

  mouseEnterHandler (event) {
    const eventValue = this.getEventValue(event)
    this.moveStartPosition = {
      x: event.pageX,
      y: event.pageY
    }
    this.subscribe(EventType.MOUSE_ENTER, eventValue)
  }

  mouseDownHandler (event) {
    const mouseMoveHandler = this.mouseMoveHandler.bind(this)
    const mouseUpHandler = this.mouseUpHandler.bind(this)
    this.unsubscribeEvent = () => {
      this.container.removeEventListener('mousemove', mouseMoveHandler)
      this.container.removeEventListener('mouseup', mouseUpHandler)
    }
    this.container.addEventListener('mousemove', mouseMoveHandler)
    this.container.addEventListener('mouseup', mouseUpHandler)
  }

  mouseUpHandler () {
    this.unsubscribeEvent()
  }

  mouseMoveHandler (event) {
    const eventValue = this.getEventValue(event)
    this.subscribe(EventType.MOUSE_MOVE, eventValue)
  }

  mouseLeaveHandler (event) {
    this.subscribe(EventType.MOUSE_LEAVE, null)
  }

  touchStartHandler (event) {
    this.subscribe(EventType.TOUCH_START, null)
  }

  touchMoveHandler (event) {
    console.log('event', event)
  }

  touchEndHandler (event) {

  }

  getEventValue (event) {
    const val = null

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
