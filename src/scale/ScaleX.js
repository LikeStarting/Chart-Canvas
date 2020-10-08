class ScaleX {
  createScale (prices, rangeLeft, rangeRight) {
    const domain = prices.map(p => p.date)
    const size = domain.length
    const range = rangeRight - rangeLeft
    const scalePoints = domain.map((d, i) => rangeLeft + range / size * i)
    return (date) => scalePoints[domain.findIndex(d => d.valueOf() === date.valueOf())]
  }
}

const scaleX = new ScaleX()
export default scaleX
