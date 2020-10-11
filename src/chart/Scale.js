import scaleX from '../scale/ScaleX'

class Scale {
  getScaleRange () {
    // const { prices } = this.data
    const [rangeLeft, rangeRight] = this.config.horizontalRange

    return [rangeLeft, rangeRight]
    // return [rangeRight - prices.length * this.config.style.tickWidth, rangeRight]
  }

  updateScale () {
    const { prices } = this.data
    const [rangeLeft, rangeRight] = this.getScaleRange()
    this.xScale = scaleX.createScale(prices, rangeLeft, rangeRight)
  }
}

export default Scale
