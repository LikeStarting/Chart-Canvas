export default class Container {
  get container () {
    return document.getElementById(this.config.root) || document.getElementsByClassName(this.config.root)[0]
  }

  _initContainer () {
    this.chartContainer = document.createElement('div')
    this.chartContainer.userSelect = 'none'
    this.chartContainer.style.position = 'relative'
    this.chartContainer.style.width = '100%'
    this.chartContainer.style.height = '100%'
    this.container.appendChild(this.chartContainer)
  }
}
