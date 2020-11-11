import { createComponent } from '../config/Register'
import ChartConfig from '../config/ChartConfig'

import DataConfig from '../data'

class ChartBase {
  constructor (data, options) {
    this._data = new DataConfig(data)
    this.options = options
    this.initContainer()
    this.initEvent()
    this.updateScale()
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

  updateData () {
    return new Promise((resolve, reject) => {
      this.data.getRenderTimeSeries(this.config.chartWidth, this.config.style.tickWidth)
        .then((d) => {
          this._renderTimeSeries = d

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
    this.components.forEach(c => {
      c.draw()
    })
  }

  destroy () {
    this.container.remove()
  }
}

export default ChartBase
