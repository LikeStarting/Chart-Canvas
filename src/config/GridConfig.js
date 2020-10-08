import BaseConfig from './BaseConfig'

import { TimeInterval } from './Constant'

class GridConfig extends BaseConfig {
  constructor (options, chartConfig) {
    super(options, chartConfig)

    this.vertical = this.getVerticalConfig(options.vertical)
    this.horizontal = this.getHorizontalConfig(options.horizontal)
  }

  getVerticalConfig (vConfig = {}) {
    if (vConfig.display) {
      if (!Object.keys.includes(vConfig.interval)) {
        throw new Error(`Can't suppport the tickInterval${vConfig.interval}`)
      }
    }

    return {
      interval: TimeInterval[vConfig.interval],
      display: vConfig.display !== false,
      dashArray: vConfig.dashArray === 0 ? 0 : vConfig.dashArray || [2, 2],
      lineWidth: vConfig.lineWidth || 1,
      lineColor: vConfig.lineColor || 'lightgray'
    }
  }

  getHorizontalConfig (hConfig = {}) {
    const margin = hConfig.margin || {}

    return {
      interval: hConfig.interval || 30,
      display: hConfig.display !== false,
      dashArray: hConfig.dashArray === 0 ? 0 : hConfig.dashArray || [2, 2],
      lineWidth: hConfig.lineWidth || 1,
      lineColor: hConfig.lineColor || 'lightgray',
      margin: {
        top: margin.top || 0,
        bottom: margin.bottom || 0
      }
    }
  }
}

export default GridConfig
