export default class Container {
  get container () {
    return document.getElementById(this.config.root) || document.getElementsByClassName(this.config.root)[0]
  }

  _initContainer () {
    this._chartContainer = document.createElement('div')
    this._chartContainer.userSelect = 'none'
    this._chartContainer.style.position = 'relative'
    this._chartContainer.style.width = '100%'
    this.container.appendChild(this._chartContainer)
  }
}
