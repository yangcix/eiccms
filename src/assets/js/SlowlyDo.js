export default class SlowlyDo {
    constructor(options) {
      const { delay } = options
      Object.assign(this, {
        delay: delay || 1000, // 执行间隔
        todoList: [], // 执行队列
        doing: false // 执行状态
      })
    }
  
    // 添加到队列
    push (fn, ...params) {
      this.todoList.push({fn, params})
      this.next()
    }
  
    // 执行队列
    next() {
      if (this.doing) return // 正在执行，不需要再开始
      const { fn, params } = this.todoList.shift() || {}
      if (!fn) return // 队列已执行完毕
      this.doing = true
      setTimeout(() => {
        fn(...params)
        this.doing = false
        this.next()
      }, this.delay)
    }
  }
  
  // // 使用
  // const slowlyDo = new SlowlyDo({ delay: 200 })
  //
  // function foo (a, b, c) {
  //   console.log(a + b + c)
  // }
  // // 添加两个函数到队列
  // slowlyDo.push(foo, 1, 2, 3)
  // slowlyDo.push(foo, 2, 3, 4)
  