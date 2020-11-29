class ScaleY {
  createScale (scaleConfig, timeSeries, top, bottom) {
    let yScale = null
    const { minVal, maxVal } = this.getValueDomain(timeSeries, scaleConfig)

    let domain = [minVal, maxVal]
    const range = [top, bottom]

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
      default:
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
      const result = Math.round(k * transformer(x) + b)
      if (clamp && result > range[1]) return range[1]
      if (clamp && result < range[0]) return range[0]
      return result
    }
  }

  getValueDomain (timeSeries, scaleConfig) {
    let minVal
    let maxVal
    const { current } = timeSeries

    const isLegal = v => v !== null && typeof v !== 'undefined'

    if (scaleConfig.value) {
      const ts = timeSeries[scaleConfig.value].filter(data => data.date >= current.startDate.valueOf() && data.date < current.endDate.valueOf() && isLegal(data.value))
      for (const v of ts) {
        if (minVal === undefined || minVal > v.value) {
          minVal = v.value
        }
        if (maxVal === undefined || maxVal < v.value) {
          maxVal = v.value
        }
      }
    } else {
      const ts = timeSeries.prices.filter(p => p.date >= current.startDate.valueOf() && p.date < current.endDate.valueOf() && isLegal(p.close) && isLegal(p.high) && isLegal(p.low))
      for (const v of ts) {
        if (minVal === undefined || minVal > v.low) {
          minVal = v.low
        }
        if (maxVal === undefined || maxVal < v.high) {
          maxVal = v.high
        }
      }
    }

    const range = Math.abs(maxVal - minVal)

    const adjustMinVal = minVal - range * 0.1
    const adjustMaxVal = maxVal + range * 0.2

    return {
      minVal: adjustMinVal > 0 ? adjustMinVal : 0,
      maxVal: adjustMaxVal
    }
  }
}

const scaleY = new ScaleY()
export default scaleY
