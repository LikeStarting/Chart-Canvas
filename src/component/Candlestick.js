import HLC from './HLC'

class Candlestick extends HLC {
  genBars (bars) {
    const { xScale, yScale } = this
    const pointBars = []

    const { lineWidth, tickBarWidth } = this.config.style
    const correct = lineWidth % 2 === 0 ? 0 : 0.5

    bars.forEach(bar => {
      const openClosePoint = {
        x: xScale(bar.date) - tickBarWidth / 2 + 0.5,
        y: null,
        width: tickBarWidth - 1,
        height: null
      }

      const topLinePoint = {
        start: { x: xScale(bar.date) - lineWidth / 2 + correct, y: yScale(bar.high) },
        end: { x: xScale(bar.date) - lineWidth / 2 + correct, y: null }
      }

      const bottomLinePoint = {
        start: { x: xScale(bar.date) - lineWidth / 2 + correct, y: null },
        end: { x: xScale(bar.date) - lineWidth / 2 + correct, y: yScale(bar.low) }
      }

      if (bar.open > bar.close) {
        openClosePoint.y = yScale(bar.open)
        openClosePoint.height = yScale(bar.close) - yScale(bar.open)
        topLinePoint.end.y = yScale(bar.open)
        bottomLinePoint.start.y = yScale(bar.close)
      } else {
        openClosePoint.y = yScale(bar.close)
        openClosePoint.height = yScale(bar.open) - yScale(bar.close)
        topLinePoint.end.y = yScale(bar.close)
        bottomLinePoint.start.y = yScale(bar.open)
      }

      pointBars.push({
        topLinePoint,
        openClosePoint,
        bottomLinePoint
      })
    })

    return pointBars
  }

  drawBars (bars, color, hollow = false) {
    this.ctx.strokeStyle = color
    this.ctx.fillStyle = color

    for (const bar of bars) {
      const { topLinePoint, openClosePoint, bottomLinePoint } = bar
      this.drawLine(topLinePoint.start, topLinePoint.end)
      this.drawLine(bottomLinePoint.start, bottomLinePoint.end)

      if (hollow) {
        this.ctx.strokeRect(openClosePoint.x, openClosePoint.y, openClosePoint.width, openClosePoint.height)
      } else {
        this.ctx.fillRect(openClosePoint.x, openClosePoint.y, openClosePoint.width, openClosePoint.height)
      }
    }
  }

  draw () {
    this.updateData()
    this.initContainer()
    this.initCanvas()

    this.drawBorder()

    this.drawBars(this.genBars(this.upBars), this.config.style.upColor, true)
    this.drawBars(this.genBars(this.downBars), this.config.style.downColor)
  }
}

export default Candlestick
