import { createConfig } from './Register'

class ChartConfig {
  constructor (options) {
    this.options = options
    this.root = options.root
    this.style = {
      width: options.style.width,
      height: options.style.height,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ...options.style.padding
      },
      tickWidth: options.style.tickWidth || 5,
      backgroundColor: options.backgroundColor,
      border: options.style.border
    }
    this.components = options.components.map(cfg => createConfig(cfg, this))
  }

  get horizontalRange () {
    return [this.style.padding.left, this.style.width - this.style.padding.left - this.style.padding.right]
  }
}

export default ChartConfig