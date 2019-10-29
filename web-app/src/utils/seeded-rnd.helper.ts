// starts with a seed and will always generate a fixed set of random results
class SeededRandom {
  // LDG using GCC's constants
  m = 0x80000000 // 2**31
  a = 1103515245
  c = 12345

  state = 0 // current seed
  
  nextInt(): number {
    this.state = (this.a * this.state + this.c) % this.m
    return this.state
  }

  nextFloat(): number {
    return this.nextInt() / (this.m - 1)
  }

  nextRange(start:number, end:number) {
    const rangeSize = end - start
    const randomizedUnder1:number = this.nextInt() / (this.m - 1)
    return start + Math.floor(randomizedUnder1 * rangeSize)
  }

  choice(array:any[]) {
    return array[this.nextRange(0, array.length)]
  }

  constructor (seed:number) {
    // either use a supplied seed, or randomise one
    this.state = seed ? seed : Math.floor(Math.random() * this.m - 1)
  }
}

export default SeededRandom

