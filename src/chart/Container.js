export default class Container {
  get container () {
    return document.getElementById(this.config.root) || document.getElementsByClassName(this.config.root)[0]
  }

  initContainer () {
    this.chartContainer = document.createElement('div')
    this.chartContainer.userSelect = 'none'
    this.chartContainer.style.position = 'relative'
    this.chartContainer.style.width = this.config.style.width + 'px'
    this.chartContainer.style.height = this.config.style.height + 'px'
    this.chartContainer.style.border = this.config.style.border
    this.container.appendChild(this.chartContainer)
  }
}
