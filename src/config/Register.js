import { ChartType } from './Constant'

import Grid from '../component/Grid'
import GridConfig from './GridConfig'

import Axis from '../component/Axis'
import AxisConfig from './AxisConfig'

import Line from '../component/Line'
import LineConfig from './LineConfig'

import Bar from '../component/Bar'
import BarConfig from './BarConfig'

import HLC from '../component/HLC'
import HLCConfig from './HLCConfig'

import Candlestick from '../component/Candlestick'
import CandlestickConfig from './CandlestickConfig'

const componentRegister = {
  [ChartType.GRID]: [Grid, GridConfig],
  [ChartType.AXIS]: [Axis, AxisConfig],
  [ChartType.Line]: [Line, LineConfig],
  [ChartType.BAR]: [Bar, BarConfig],
  [ChartType.HLC]: [HLC, HLCConfig],
  [ChartType.CANDLESTICK]: [Candlestick, CandlestickConfig]
}

export function createComponent (data, config) {
  for (const type of Object.keys(componentRegister)) {
    if (config.type === type) {
      const ComponentConstructor = componentRegister[type][0]
      return new ComponentConstructor(data, config)
    }
  }

  throw new Error(`Cant't support the type: ${config.type}.`)
}

export function createConfig (options, chartConfig) {
  for (const type of Object.keys(componentRegister)) {
    if (options.type === type) {
      const ConfigConstructor = componentRegister[type][1]
      return new ConfigConstructor(options, chartConfig)
    }
  }

  throw new Error(`Cant't support the type: ${options.type}.`)
}
