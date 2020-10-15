import BaseConfig from './BaseConfig'

import { TimeInterval } from './Constant'

class AxisConfig extends BaseConfig {
  constructor (options, chartConfig) {
    super(options, chartConfig)

    this.locate = options.locate || 'bottom'

    this.style = this.getStyle(options.style)

    this.tickIntervalX = TimeInterval[options.tickIntervalX]

    if (!options.position || !options.position.height) {
      this.position.height = 15
    }
  }

  getStyle (style = {}) {
    return {
      lineWidth: style.lineWidth || 1,
      lineColor: style.lineColor || 'black',
      tickLineWidth: style.tickLineWidth || 1,
      tickLineLength: style.tickLineLength || 15,
      tickLineColor: style.tickLineColor || 'black',
      textSize: style.textSize || 10,
      textWeight: style.textWeight || 'normal',
      textFamily: style.textFamily || 'calibri',
      textColor: style.textColor || 'black',
      textAlign: style.textAlign || 'left',
      textPadding: style.textPadding || [0, 0, 0, 0]
      // textFormat: ''
    }
  }
}

export default AxisConfig
