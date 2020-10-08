
function mix (baseClass, ...mixins) {
  class Mix extends baseClass {
    constructor (...args) {
      super(...args)
      for (const Mixin of mixins) {
        copyProps(this, new Mixin())
      }
    }
  }

  for (const Mixin of mixins) {
    copyProps(Mix, Mixin)
    copyProps(Mix.prototype, Mixin.prototype)
  }

  function copyProps (target, source) {
    for (const key of Reflect.ownKeys(source)) {
      if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
      }
    }
  }
  return Mix
}

export default mix
