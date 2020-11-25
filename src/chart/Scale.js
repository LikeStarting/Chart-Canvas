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
    const { domain, scalePoints, xScale } = scaleX.createScale(prices, rangeLeft, rangeRight)

    this.xScale = xScale
    this.domain = domain
    this.scalePoints = scalePoints
  }
}

export default Scale
