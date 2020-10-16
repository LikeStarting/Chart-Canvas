import prices from './data/daily'

import Chart from '../chart'

const priceScaleType = 'linear'
// const volumeScaleType = 'pow'

const widthPrice = 300
const heightPrice = 300
const heightVolume = 85
const heightAxis = 15
const width = 1000

const gridXInterval = 'm1'
const gridXInterval1 = 'm1'
const gridXInterval2 = 'Q1'
const axisXInterval = 'm1'

const volumes = []

prices.forEach(v => {
  // eslint-disable-next-line no-param-reassign
  v.date = new Date(v.date)
  if (v.volume > 0) {
    volumes.push(v.volume)
  }
})

const holidays = [new Date(2019, 4, 28), new Date(2019, 4, 27), new Date(2019, 1, 4),
  new Date(2019, 1, 5), new Date(2019, 1, 6), new Date(2019, 1, 7), new Date(2019, 1, 8),
  new Date(2018, 9, 1), new Date(2018, 9, 2), new Date(2018, 9, 3), new Date(2018, 9, 4),
  new Date(2018, 9, 5)
]

const body = document.getElementsByTagName('body')[0]
const div = document.createElement('div')
div.style.height = '70vh'
div.style.padding = '0 10%'
div.style.margeTop = '20px'
div.className = 'container'
body.appendChild(div)

const data = {
  prices,
  periodicity: 1,
  holidays,
  marketTime: [['9:30', '11:00'], ['13:01', '15:00']]
}

const options = {
  root: 'container',
  zoom: {
    enable: true
  },
  style: {
    width,
    height: heightAxis + heightPrice + heightVolume,
    tickWidth: 4,
    border: '1px solid #000',
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 40
    }
  },
  components: [
    {
      type: 'grid',
      id: 'price_grid',
      vertical: {
        interval: gridXInterval
      },
      horizontal: {
        interval: 30
      },
      position: {
        height: heightPrice
      },
      yScale: {
        type: priceScaleType
      }
    },
    {
      type: 'grid',
      id: 'price_grid2',
      vertical: {
        interval: gridXInterval2,
        dashArray: 0
      },
      horizontal: {
        display: false
      },
      position: {
        height: heightPrice
      },
      yScale: {
        type: priceScaleType
      }
    },
    {
      type: 'grid',
      id: 'volume_grid',
      vertical: {
        interval: gridXInterval1
      },
      horizontal: {
        interval: 30
      },
      position: {
        top: heightPrice,
        height: heightVolume
      },
      yScale: {
        type: priceScaleType
      },
      border: {
        top: {
          display: true
        }
      }
    },
    {
      type: 'grid',
      id: 'volume_grid2',
      vertical: {
        interval: gridXInterval2,
        dashArray: 0
      },
      horizontal: {
        display: false
      },
      position: {
        top: heightPrice,
        height: heightVolume
      },
      yScale: {
        type: priceScaleType
      }
    },
    {
      type: 'axis',
      tickIntervalX: axisXInterval,
      // textOrient: 'right',
      position: {
        top: heightPrice + heightVolume
      }
      // style: {
      //   textFormat: '%b %d'
      // }
    }
    // {
    //   name: 'volume grid',
    //   type: 'grid',
    //   vertical: {
    //     interval: gridXInterval
    //   },
    //   horizontal: {
    //     interval: 30,
    //     displayLabel: true,
    //     labelColor: '#a9acaf'
    //   },
    //   yScale: {
    //     value: 'price.volume',
    //     type: volumeScaleType
    //   },
    //   position: {
    //     top: heightPrice,
    //     height: heightVolume
    //   }
    // },
    // {
    //   type: 'grid',
    //   vertical: {
    //     interval: gridXInterval1,
    //     dashArray: 0
    //   },
    //   horizontal: {
    //     display: false
    //   },
    //   position: {
    //     top: heightPrice,
    //     height: heightVolume
    //   },
    //   yScale: {
    //     value: 'price.volume',
    //     type: volumeScaleType
    //   }
    // },
    // {
    //   type: 'line',
    //   value: 'tsVolMA',
    //   title: 'VOL MA 5',
    //   yScale: {
    //     type: volumeScaleType,
    //     value: 'price.volume'
    //   },
    //   position: {
    //     top: heightPrice,
    //     height: heightVolume
    //   },
    //   style: {
    //     lineColor: 'red'
    //   }
    // },
    // {
    //   name: 'volume bar',
    //   type: 'bar',
    //   yScale: {
    //     type: volumeScaleType,
    //     value: 'price.volume'
    //   },
    //   position: {
    //     top: heightPrice,
    //     height: heightVolume
    //   },
    //   style: {
    //     upColor: 'rgb(39, 54, 233)',
    //     downColor: 'rgb(222, 50, 174)'
    //   }
    // },
    // {
    //   type: 'axis',
    //   ticksIntervalX: gridXInterval,
    //   textOrient: 'right',
    //   position: {
    //     top: heightPrice + heightVolume
    //   },
    //   style: {
    //     textFormat: '%b %d'
    //   }
    // },
    // {
    //   name: 'ma 50 line',
    //   type: 'line',
    //   value: 'tsPriceMA200',
    //   title: 'MA 200D',
    //   yScale: {
    //     type: priceScaleType
    //   },
    //   position: {
    //     height: heightPrice
    //   }
    // },
    // {
    //   type: 'line',
    //   value: 'tsPriceMA50',
    //   title: 'MA 50D',
    //   yScale: {
    //     type: priceScaleType
    //   },
    //   position: {
    //     height: heightPrice
    //   },
    //   style: {
    //     lineColor: 'green'
    //   }
    // },
    // {
    //   name: 'price bar',
    //   type: 'hlc',
    //   yScale: {
    //     type: priceScaleType
    //   },
    //   position: {
    //     height: heightPrice
    //   },
    //   border: {
    //     bottom: {
    //       lineWidth: 1,
    //       extendAll: true
    //     }
    //   },
    //   style: {
    //     upColor: 'rgb(39, 54, 233)',
    //     downColor: 'rgb(222, 50, 174)',
    //     tickBarWidth: 4,
    //     lineWidth: 2
    //   }
    // }
  ]
}

const chart = new Chart(
  data, options
)
