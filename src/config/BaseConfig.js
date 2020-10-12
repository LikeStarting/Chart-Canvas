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

  get id () {
    return this.options.id
  }

  get type () {
    return this.options.type
  }

  get width () {
    return this.getWidthNumber()
  }

  get height () {
    return this.getHeightNumber()
  }

  get coordinate () {
    const right = this.getWidthNumber()
    const bottom = this.getHeightNumber()

    return {
      top: 0,
      bottom,
      left: 0,
      right
    }
  }

  getWidthNumber () {
    let { width } = this.position
    const parentWidth = this.chartConfig.style.width
    const { left, right } = this.chartConfig.style.padding

    if (/\d%/.test(width)) {
      const pct = parseFloat(width) >= 100 ? 100 : parseFloat(width)
      width = parentWidth * pct / 100 - left - right
      return width
    }

    const chartContentWidth = parentWidth - left - right
    width = chartContentWidth >= width ? width : chartContentWidth

    return width
  }

  getHeightNumber () {
    let { height } = this.position
    const parentHeight = this.chartConfig.style.height
    const { top, bottom } = this.chartConfig.style.padding

    if (/\d%/.test(height)) {
      const pct = parseFloat(height) >= 100 ? 100 : parseFloat(height)
      height = parentHeight * pct / 100 - top - bottom
      return height
    }

    const chartContentHeight = parentHeight - top - bottom
    height = chartContentHeight >= height ? height : chartContentHeight

    return height
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
