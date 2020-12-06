class ScaleY {
  createScale (scaleConfig, timeSeries, top, bottom) {
    let scaleMap = null
    const { minVal, maxVal } = this.getValueDomain(timeSeries, scaleConfig)
    const range = [top, bottom]

    if (!['linear', 'log', 'pow', 'auto'].includes(scaleConfig.type)) {
      throw new Error(`Do not support ${scaleConfig.type} yet.`)
    }

    let domain = this.adjustValueDomain(scaleConfig, minVal, maxVal)
    const [adjustMinVal, adjustMaxVal] = domain

    switch (scaleConfig.type) {
      case 'linear':
        scaleMap = this.getScaleMap(scaleConfig, domain, range)
        break
      case 'log':
        scaleMap = this.getScaleMap(scaleConfig, domain, range, true)
        break
      case 'pow':
        if (scaleConfig.pow < 0) domain = [maxVal, minVal]
        scaleMap = this.getScaleMap(scaleConfig, domain, range)
        break
      case 'auto':
        scaleMap = this.getScaleMap(scaleConfig, domain, range)
        break
      default:
        scaleMap = this.getScaleMap(scaleConfig, domain, range)
        break
    }

    const { yScale, yScaleInvert } = scaleMap

    return {
      yScale,
      yScaleInvert,
      minVal: adjustMinVal,
      maxVal: adjustMaxVal
    }
  }

  getScaleMap (scaleConfig, domain, range, clamp = false) {
    let transformer = null
    let transformerInvert = null
    switch (scaleConfig.type) {
      case 'linear':
        transformer = (d) => d
        transformerInvert = (d) => d
        break
      case 'log':
        transformer = (d) => Math.log(d) / Math.log(scaleConfig.logBase)
        transformerInvert = (d) => Math.pow(scaleConfig.logBase, d)
        break
      case 'pow':
        transformer = (d) => Math.pow(d, scaleConfig.powExponent)
        transformerInvert = (d) => Math.pow(10, Math.log10(d) / scaleConfig.powExponent)
        break
      case 'auto':
        transformer = (d) => Math.log10(d)
        transformerInvert = (d) => Math.pow(10, d)
        break
      default:
        transformer = (d) => d
        transformerInvert = (d) => d
        break
    }

    const k = (range[1] - range[0]) / (transformer(domain[1]) - transformer(domain[0]))
    const b = range[0] - k * transformer(domain[0])

    const yScale = (x) => {
      const result = k * transformer(x) + b
      if (clamp && result > range[1]) return range[1]
      if (clamp && result < range[0]) return range[0]
      return result
    }

    const yScaleInvert = (y) => {
      const v = transformerInvert((y - b) / k)
      return v
    }

    return {
      yScale,
      yScaleInvert
    }
  }

  getValueDomain (timeSeries, scaleConfig) {
    let minVal
    let maxVal
    const { current } = timeSeries

    const isLegal = v => v !== null && typeof v !== 'undefined' && v !== 0

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

    return {
      minVal,
      maxVal
    }
  }

  adjustValueDomain (scaleConfig, minVal, maxVal) {
    const top = 0.2
    const bottom = 0.1
    let adjustMinVal
    let adjustMaxVal
    let minType
    let maxType
    let adjustMinType
    let adjustMaxType
    switch (scaleConfig.type) {
      case 'linear':
        adjustMinVal = minVal - (maxVal - minVal) * bottom
        adjustMaxVal = maxVal + (maxVal - minVal) * top
        break
      case 'log':
        minType = Math.log(minVal || 2) / Math.log(scaleConfig.logBase)
        maxType = Math.log(maxVal) / Math.log(scaleConfig.logBase)
        adjustMinType = minType - (maxType - minType) * bottom
        adjustMaxType = maxType + (maxType - minType) * top
        adjustMinVal = scaleConfig.logBase ** adjustMinType
        adjustMaxVal = scaleConfig.logBase ** adjustMaxType
        break
      case 'pow':
        minType = minVal ** scaleConfig.powExponent
        maxType = maxVal ** scaleConfig.powExponent
        adjustMinType = minType - (maxType - minType) * bottom
        adjustMaxType = maxType + (maxType - minType) * top
        adjustMinVal = adjustMinType ** (1 / scaleConfig.powExponent)
        adjustMaxVal = adjustMaxType ** (1 / scaleConfig.powExponent)
        break
      case 'auto':
        minType = Math.log(minVal || 2) / Math.log(scaleConfig.logBase)
        maxType = Math.log(maxVal) / Math.log(scaleConfig.logBase)
        adjustMinType = minType - (maxType - minType) * bottom
        adjustMaxType = maxType + (maxType - minType) * top
        adjustMinVal = scaleConfig.logBase ** adjustMinType
        adjustMaxVal = scaleConfig.logBase ** adjustMaxType
        break
      default:
        throw new Error(`not support the type of scale: ${scaleConfig.type}`)
    }

    return [adjustMinVal, adjustMaxVal]
  }
}

const scaleY = new ScaleY()
export default scaleY
