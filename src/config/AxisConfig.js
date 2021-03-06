import BaseConfig from './BaseConfig'

import { TimeInterval } from './Constant'

class AxisConfig extends BaseConfig {
  constructor (options, chartConfig) {
    super(options, chartConfig)

    this.locate = options.locate || 'bottom'

    this.style = this.getStyle(options.style)
    this.label = this.getLabelConfig(options.label)

    if (this.locate === 'top' || this.locate === 'bottom') {
      this.tickIntervalX = TimeInterval[options.tickIntervalX]
    } else if (this.locate === 'left' || this.locate === 'right') {
      this.tickIntervalY = options.tickIntervalY
    } else {
      throw Error(`Can't support the locate: ${options.locate}.`)
    }

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
      textVerticalAlign: style.textVerticalAlign || 'middle',
      textPadding: style.textPadding || [0, 0, 0, 0]
      // textFormat: ''
    }
  }

  getLabelConfig (label = {}) {
    const horizontal = label.horizontal || {}
    const vertical = label.vertical || {}

    const defaultLabelX = {
      display: true,
      fontSize: 10,
      fontWeight: 'normal',
      fontFamily: 'calibri',
      fontColor: '#fff',
      textAlign: 'left',
      padding: [2, 5, 2, 5],
      backgroundColor: 'rgba(0,0,0,0.65)',
      borderWidth: 0,
      borderColor: '#000'
    }
    const defaultLabelY = {
      display: true,
      fontSize: 10,
      fontWeight: 'normal',
      fontFamily: 'calibri',
      fontColor: '#fff',
      textAlign: 'left',
      padding: [5, 0, 5, 0],
      backgroundColor: 'rgba(0,0,0,0.65)',
      borderWidth: 0,
      borderColor: '#000'
    }

    return {
      horizontal: {
        ...defaultLabelY,
        ...horizontal
      },
      vertical: {
        ...defaultLabelX,
        ...vertical
      }
    }
  }
}

export default AxisConfig
