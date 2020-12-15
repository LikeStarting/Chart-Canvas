import { createComponent } from '../config/Register'
import ChartConfig from '../config/ChartConfig'

import DataConfig from '../data'

class ChartBase {
  constructor (data, options) {
    this._data = new DataConfig(data)
    this.options = options

    this._destroyed = false
    this.transfrom = {
      x: 0
    }

    this.initContainer()
    this.initEvent()
    this.updateData().then(() => {
      this.draw()
    })
  }

  get renderTimeSeries () {
    return this._renderTimeSeries
  }

  set options (options) {
    this.config = new ChartConfig(options)
    // this.config.components.forEach(c => {
    //   const instance = createComponent(c, this.data)
    //   instance.chart = this
    //   this.components.push(c)
    //   instance.draw()
    // })
  }

  updateData (offsetX) {
    return new Promise((resolve, reject) => {
      this.data.getRenderTimeSeries(this.config.chartWidth, this.config.style.tickWidth, offsetX)
        .then((d) => {
          this._renderTimeSeries = d
          this.updateScale()

          if (!this.components) {
            this.initComponents()
          }

          resolve(d)
        })
        .catch(err => {
          console.error(`Something is wrong: ${err}, when getting time series`)
        })
    })
  }

  initComponents () {
    this.components = []
    this.config.components.forEach(c => {
      const instance = createComponent(this.data, c)
      instance.chart = this
      this.components.push(instance)
    })
  }

  draw () {
    if (this._destroyed) return

    this.components.forEach(c => {
      c.draw()
    })
  }

  update (x) {
    if (this._destroyed) return

    this.components.forEach(c => {
      c.update(x)
    })
  }

  redraw (x) {
    if (this._destroyed) return

    if (x) this.x = x
    const offsetX = x || this.transfrom.x

    this.updateData(offsetX).then(d => {
      this.update(x)
    })
  }

  destroy () {
    this.container.parentNode.removeChild(this.container)
    this.chartContainer.parentNode.removeChild(this.chartContainer)

    this._destroyed = true
  }
}

export default ChartBase
