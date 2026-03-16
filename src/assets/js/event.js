
class Event {
    constructor() {
      this.events = {}
    }
    on(eventType, callBack) {
      if (!Object.prototype.hasOwnProperty.call(this.events, eventType)) {
        this.events[eventType] = {
          list: []
        }
      }
      this.events[eventType].list.push(callBack)
    }
    emit() {
      const args = Array.prototype.slice.call(arguments)
      const eventType = args[0]
      if (!Object.prototype.hasOwnProperty.call(this.events, eventType)) {
        return
      }
      const _args = args.slice(1)
      this.events[eventType].list.forEach(function (fn) {
        fn && fn(..._args)
      })
    }
    off(eventType, callBack) {
      if (!Object.prototype.hasOwnProperty.call(this.events, eventType)) {
        return false
      }
      const eventsList = this.events[eventType].list
      let len = eventsList.length
      for (let i = 0; i < len; i++) {
        let item = eventsList[i]
        if (item === callBack) {
          eventsList.splice(i, 1)
          break
        }
      }
    }
  }
  export default Event
  