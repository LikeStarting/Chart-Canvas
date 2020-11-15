import Base from './Base'

class Crosshair extends Base {
  // constructor (data, config) {
  //   super(data, config)

  //   this.
  // }

  onMouseMove () {

  }

  getLinePoints () {
    return {
      x: {
        start: { x: this.config.coordinate.left, y: 0 },
        end: { x: this.config.coordinate.right, y: 0 }
      },
      y: {
        start: { x: 0, y: this.config.coordinate.top },
        end: { x: 0, y: this.config.coordinate.bottom }
      }
    }
  }

  draw () {
    this.initContainer()
    this.initCanvas()
  }
}

export default Crosshair
