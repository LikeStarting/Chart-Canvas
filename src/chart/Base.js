import { createComponent } from '../config/Register'
import ChartConfig from '../config/ChartConfig'

import DataConfig from '../data'

class ChartBase {
  constructor (data, options) {
    this._data = new DataConfig(data)
    this.options = options
    this._initContainer()
    this.initComponents()
    this.updateScale()
    this.draw()
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
