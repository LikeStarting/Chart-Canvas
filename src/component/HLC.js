import Base from './Base'

import scaleY from '../scale/ScaleY'

class HLC extends Base {
  updateData () {
    const d = this.renderTimeSeries

    if (this.config.type === 'candlestick') {
      this.upBars = d.prices.filter(p => p.close >= p.open)
      this.downBars = d.prices.filter(p => p.close < p.open)
    } else {
      this.upBars = d.prices.filter(p => p.chg >= 0)
      this.downBars = d.prices.filter(p => p.chg < 0)
    }

    const { yScale } = scaleY.createScale(
      this.config.yScale,
      d,
      this.config.coordinate.top,
      this.config.coordinate.bottom
    )
    this.yScale = yScale
  }

  draw () {
    this.updateData()
  }
}

export default HLC
