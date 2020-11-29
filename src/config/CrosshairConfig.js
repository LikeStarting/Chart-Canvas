import BaseConfig from './BaseConfig'

class CrosshairConfig extends BaseConfig {
  constructor (options, chartConfig) {
    super(options, chartConfig)

    this.style = this.getStyle(options.style)

    this.tooltip = options.tooltip !== undefined ? options.tooltip : this.defaultTooltip()
  }

  getStyle (style = {}) {
    return {
      lineColor: style.lineColor || 'black',
      lineWidth: style.lineWidth || 1,
      dashArray: style.dashArray === 0 ? 0 : style.dashArray || [2, 2]
    }
  }

  defaultTooltip () {
    return function (scope) {
      const { price } = scope

      return `
        <div>
        
        </div>  
      `
    }
  }
}

export default CrosshairConfig
