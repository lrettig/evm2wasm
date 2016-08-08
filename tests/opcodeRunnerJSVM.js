// var runState = {
//   stateManager: stateManager,
//   returnValue: false,
//   stopped: false,
//   vmError: false,
//   suicideTo: undefined,
//   programCounter: 0,
//   opCode: undefined,
//   opName: undefined,
//   gasLeft: new BN(opts.gasLimit),
//   gasLimit: new BN(opts.gasLimit),
//   gasPrice: opts.gasPrice,
//   memory: [],
//   memoryWordCount: 0,
//   stack: [],
//   logs: [],
//   validJumps: [],
//   gasRefund: new BN(0),
//   highestMemCost: new BN(0),
//   depth: opts.depth || 0,
//   suicides: opts.suicides || {},
//   block: block,
//   callValue: opts.value || new BN(0),
//   address: opts.address || utils.zeros(32),
//   caller: opts.caller || utils.zeros(32),
//   origin: opts.origin || opts.caller || utils.zeros(32),
//   callData: opts.data || new Buffer([0]),
//   code: opts.code,
//   populateCache: opts.populateCache === undefined ? true : opts.populateCache,
//   enableHomestead: this.opts.enableHomestead === undefined ? block.isHomestead() : this.opts.enableHomestead // this == vm
// }
const fs = require('fs')
const tape = require('tape')
const ethUtil = require('ethereumjs-util')
const dir = `${__dirname}/opcode`
const opFunc = require('ethereumjs-vm/lib/opFns.js')
const BN = require('bn.js')

let testFiles = fs.readdirSync(dir).filter((name) => name.endsWith('.json'))

tape('testing EVM1 Ops', (t) => {
  testFiles.forEach((path) => {
    let opTest = require(`${dir}/${path}`)
    opTest.forEach((test) => {

      // FIXME: have separate `t.test()` for better grouping
      t.comment(`testing ${test.op} ${test.description}`)

      // populate the stack with predefined values
      const stack = test.stack.in.map((i) => new Buffer(i.slice(2), 'hex'))

      const runState = {
        memory: [],
        stack: stack,
        opCode: parseInt(test.value),
        highestMemCost: new BN(0),
        gasLeft: new BN("100000000000000000")
      }

      // populate the memory
      if (test.memory && test.memory.in) {
        for(let item in test.memory.in){
          item |= 0
          const memIn = new Buffer(test.memory.in[item][0].slice(2), 'hex')
          runState.memory.splice(item, 32, ...memIn)

        }
      }

      // Runs the opcode. 
      const noStack = new Set(['DUP', 'SWAP'])
      let args = []
      if(noStack.has(test.op)){
        args = [runState]
      } else {
        args = stack.slice()
        args.reverse()
        args.push(runState)
        runState.stack = []
      }
      const result = opFunc[test.op](...args)
      if (result) {
        runState.stack.push(result)
      }

      test.stack.out.forEach((item, index) => {
        t.equals('0x' + ethUtil.setLength(runState.stack[index], 32).toString('hex'), item, 'stack items should be equal')
      })

      // check the memory
      if (test.memory) {
        //TODO
      }

      // check for EVM return value
      if (test.return) {
        //TODO
      }
    })
  })
  t.end()
})
