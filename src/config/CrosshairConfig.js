import BaseConfig from './BaseConfig'

class CrosshairConfig extends BaseConfig {
  constructor (options, chartConfig) {
    super(options, chartConfig)

    this.style = this.getStyle(options.style)

    this.tooltip = options.tooltip !== undefined ? options.tooltip : this.defaultTooltip()
  }

  getStyle (style = {}) {
    return {
      lineColor: style.lineColor || 'black',
      lineWidth: style.lineWidth || 1,
      dashArray: style.dashArray === 0 ? 0 : style.dashArray || [2, 2],
      tooltipOpacity: style.tooltipOpacity || 0.7
    }
  }

  defaultTooltip () {
    return function (scope) {
      const { price } = scope
      const { date } = price
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes().toString().padStart(2, '0')
      const timeStr = `${year}-${month}-${day} ${hour}:${minute}`

      const style = `
        <style>
          #crosshair-tooltip {
            width: 140px;
            padding: 5px 0;
            background: #fff;
            border-radius: 5px;
            border: 1px solid #000;
          }
          #crosshair-tooltip div {
            font-size: 0;
          }
          #crosshair-tooltip div span {
            display: inline-block;
            padding: 0 5px;
            font-size: 11px;
            color: grey;
          }
          #crosshair-tooltip div span:first-child {
            width: 40px;
            text-align: right;
          }
          #crosshair-tooltip div span:last-child {
            padding-right: 0;
            width: 80px
          }
        </style>
      `
      return `
        <div id="crosshair-tooltip">
          ${style}
          <div>
            <span>Date:</span>
            <span>${timeStr}</span>
          </div>
          <div>
            <span>Open:</span>
            <span>${price.open}</span>
          </div>
          <div>
            <span>High:</span>
            <span>${price.high}</span>
          </div>
          <div>
            <span>Low:</span>
            <span>${price.low}</span>
          </div>
          <div>
            <span>Last:</span>
            <span>${price.close}</span>
          </div>
          <div>
            <span>Volume:</span>
            <span>${price.volume}</span>
          </div>
        </div>  
      `
    }
  }
}

export default CrosshairConfig
