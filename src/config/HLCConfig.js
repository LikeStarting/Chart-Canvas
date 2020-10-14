import BaseConfig from './BaseConfig'

class HLCConfig extends BaseConfig {
  constructor (options, chartConfig) {
    super(options, chartConfig)

    this.style = {
      upColor: options.style.upColor || 'red',
      downColor: options.style.downColor || 'green',
      lineWidth: options.style.lineWidth || 2,
      tickBarWidth: options.style.tickBarWidth || 4
    }
  }
}

export default HLCConfig
