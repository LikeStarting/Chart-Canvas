import BaseConfig from './BaseConfig'

class CrosshairConfig extends BaseConfig {
  constructor (options, chartConfig) {
    super(options, chartConfig)

    this.style = this.getStyle(options.style)
  }

  getStyle (style = {}) {
    return {
      lineColor: style.lineColor || 'black',
      lineWidth: style.lineWidth || 1,
      dashArray: style.dashArray === 0 ? 0 : style.dashArray || [2, 2]
    }
  }
}

export default CrosshairConfig
