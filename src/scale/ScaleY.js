class ScaleY {
  createScale (scaleConfig, timeSeries, top, bottom) {
    let yScale = null
    const { minVal, maxVal } = this.getValueDomain(timeSeries)

    let domain = [minVal, maxVal]
    const range = [bottom, top]

    if (!['linear', 'log', 'pow', 'auto'].includes(scaleConfig.type)) {
      throw new Error(`Do not support ${scaleConfig.type} yet.`)
    }

    switch (scaleConfig.type) {
      case 'linear':
        yScale = this.getScaleMap(scaleConfig, domain, range)
        break
      case 'log':
        if (scaleConfig.logBase < 1) domain = [maxVal, minVal]
        yScale = this.getScaleMap(scaleConfig, domain, range, true)
        break
      case 'pow':
        if (scaleConfig.pow < 0) domain = [maxVal, minVal]
        yScale = this.getScaleMap(scaleConfig, domain, range)
        break
      case 'auto':
        yScale = this.getScaleMap(scaleConfig, domain, range)
        break
    }

    return {
      yScale,
      minVal,
      maxVal
    }
  }

  getScaleMap (scaleConfig, domain, range, clamp = false) {
    let transformer = null
    switch (scaleConfig.type) {
      case 'linear':
        transformer = (d) => d
        break
      case 'log':
        transformer = (d) => Math.log(d) / Math.log(scaleConfig.logBase)
        break
      case 'pow':
        transformer = (d) => Math.pow(d, scaleConfig.powExponent)
        break
      case 'auto':
        transformer = (d) => Math.log10(d)
        break
      default:
        transformer = (d) => d
        break
    }

    const k = (range[1] - range[0]) / (transformer(domain[1]) - transformer(domain[0]))
    const b = range[0] - k * transformer(domain[0])

    return (x) => {
      const result = k * x + b
      if (clamp && result > range[1]) return range[1]
      if (clamp && result < range[0]) return range[0]
      return result
    }
  }

  getValueDomain (timeSeries) {
    let minVal
    let maxVal

    const isLegal = v => v !== null && typeof v !== 'undefined'
    const ts = timeSeries.prices.filter(p => isLegal(p.close) && isLegal(p.high) && isLegal(p.low))

    for (const v of ts) {
      if (minVal === undefined || minVal > v.low) {
        minVal = v.low
      }
      if (maxVal === undefined || maxVal < v.high) {
        maxVal = v.high
      }
    }

    return {
      minVal,
      maxVal
    }
  }
}

const scaleY = new ScaleY()
export default scaleY
