import scaleX from '../scale/ScaleX'

class Scale {
  getScaleRange () {
    const { prices } = this.renderTimeSeries
    const rangeRight = this.config.horizontalRange[1]

    return [rangeRight - prices.length * this.config.style.tickWidth, rangeRight]
  }

  updateScale () {
    const { prices } = this.renderTimeSeries
    const [rangeLeft, rangeRight] = this.getScaleRange()
    this.xScale = scaleX.createScale(prices, rangeLeft, rangeRight)
  }
}

export default Scale
