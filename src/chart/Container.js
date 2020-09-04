export default class Container {
  constructor () {
    this._initContainer()
  }

  get container () {
    return document.getElementById(this.config.selector) || document.getElementsByClassName('this.config.selector')
  }

  _initContainer () {
    this._chartContainer = document.createElement('div')
    this._chartContainer.userSelect = 'none'
    this._chartContainer.style.position = 'relative'
    this._chartContainer.style.width = '100%'
    this.container.appendChild(this._chartContainer)
  }
}
