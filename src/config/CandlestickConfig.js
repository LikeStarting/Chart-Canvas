import BaseConfig from './BaseConfig'

class CandlestickConfig extends BaseConfig {
  constructor (options, chartConfig) {
    super(options, chartConfig)

    this.style = {
      upColor: options.style.upColor || '#FF4B33',
      downColor: options.style.downColor || '#00AF5D',
      lineWidth: options.style.lineWidth || 1,
      tickBarWidth: options.style.tickBarWidth || 4
    }
  }
}

export default CandlestickConfig
