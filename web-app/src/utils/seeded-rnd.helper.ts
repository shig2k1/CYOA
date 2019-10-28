class SeededRandom {
  // LDG using GCC's constants
  m = 0x80000000 // 2**31
  a = 1103515245
  c = 12345

  state = 0
  
  constructor (seed:number) {
    this.state = seed ? seed : Math.floor(Math.random() * this.m - 1)
    console.log('state', this.state)
  }
}

export default new SeededRandom(123)
