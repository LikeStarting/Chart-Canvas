import { ScaleType } from './Constant'

class BaseConfig {
  constructor (options, chartConfig) {
    this.options = options
    this.chartConfig = chartConfig
    this.position = {
      top: chartConfig.style.padding.top,
      right: chartConfig.style.padding.right,
      bottom: chartConfig.style.padding.bottom,
      left: chartConfig.style.padding.left,
      width: '100%',
      height: '100%',
      ...this.options.position
    }

    this.setYScale(options.yScale)
  }

  get type () {
    return this.options.type
  }

  setYScale (yScale = {}) {
    this.yScale = {}
    this.yScale.value = yScale.value

    if (yScale.type) {
      if (!Object.values(ScaleType).includes(yScale.type)) {
        throw new Error(`Can't support the scale type: ${yScale.type}.`)
      }
    }

    this.yScale.type = yScale.type || 'linear'
    this.yScale.logBase = yScale.logBase || 10
    this.yScale.powExponent = yScale.powExponent || 0.5
  }
}

export default BaseConfig
