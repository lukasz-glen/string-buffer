import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('StringBufferTest', function () {
  let stringBufferTest

  beforeEach(async function () {
    const factory = await ethers.getContractFactory('StringBufferTest')
    stringBufferTest = await factory.deploy()
  })

  it('short strings', async function () {
    const stringBufferOutput = await stringBufferTest.test1(256, ['0x012345', '0x67', '0x89'])
    expect(stringBufferOutput).to.be.equal('0x0123456789')
  })

  it('long strings', async function () {
    const string1 = '0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    const string2 = '0x22222222222222222222222222222222222222222222222222222222222222222222222222222222222222'
    const stringBufferOutput = await stringBufferTest.test1(256, [string1, string2])
    expect(stringBufferOutput).to.be.equal(string1 + string2.substring(2))
  })

  it('overflow strings', async function () {
    const string1 = '0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    const string2 = '0x22222222222222222222222222222222222222222222222222222222222222222222222222222222222222'
    const string3 = '0x33333333333333333333333333333333333333333333333333333333333333333333333333333333333333'
    const stringBufferOutput = await stringBufferTest.test1(128, [string1, string2, string3])
    // one 0x and 3 elts
    expect(stringBufferOutput.length).to.be.equal(2 + 3 * 86)
  })

  it('multiple overflows strings', async function () {
    const string1 = '0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    const string2 = '0x22222222222222222222222222222222222222222222222222222222222222222222222222222222222222'
    const string3 = '0x33333333333333333333333333333333333333333333333333333333333333333333333333333333333333'
    const tab = []
    for (let i = 0 ; i < 10 ; i ++) {
      tab[3*i] = string1
      tab[3*i + 1] = string1
      tab[3*i + 2] = string1
    }
    const stringBufferOutput = await stringBufferTest.test1(64, tab)
    // one 0x and 30 elts
    expect(stringBufferOutput.length).to.be.equal(2 + 30 * 86)
  })

  it('single bytes32', async function () {
    const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
    const stringBufferOutput = await stringBufferTest.test2(256, [bytes32_1])
    expect(stringBufferOutput).to.be.equal(bytes32_1)
  })

  it('multiple bytes32', async function () {
    const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
    const bytes32_2 = '0x6700000000000000000000000000000000000000000000000000000000000000'
    const bytes32_3 = '0x8900000000000000000000000000000000000000000000000000000000000000'
    const stringBufferOutput = await stringBufferTest.test2(256, [bytes32_1, bytes32_2, bytes32_3])
    expect(stringBufferOutput).to.be.equal(bytes32_1 + bytes32_2.substring(2) + bytes32_3.substring(2))
  })

  it('overflow bytes32', async function () {
    const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
    const bytes32_2 = '0x6700000000000000000000000000000000000000000000000000000000000000'
    const bytes32_3 = '0x8900000000000000000000000000000000000000000000000000000000000000'
    const bytes32_4 = '0xab00000000000000000000000000000000000000000000000000000000000000'
    // a short buffer
    const stringBufferOutput = await stringBufferTest.test2(64, [bytes32_1, bytes32_2, bytes32_3, bytes32_4])
    expect(stringBufferOutput).to.be.equal(
      bytes32_1 + bytes32_2.substring(2) + bytes32_3.substring(2) + bytes32_4.substring(2)
    )
  })

  it('multiple overflow bytes32', async function () {
    const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
    const bytes32_2 = '0x6700000000000000000000000000000000000000000000000000000000000000'
    const bytes32_3 = '0x8900000000000000000000000000000000000000000000000000000000000000'
    const bytes32_4 = '0xab00000000000000000000000000000000000000000000000000000000000000'
    const tab = []
    for (let i = 0 ; i < 10 ; i ++) {
      tab[4*i] = bytes32_1
      tab[4*i + 1] = bytes32_2
      tab[4*i + 2] = bytes32_3
      tab[4*i + 3] = bytes32_4
    }
    // a short buffer
    const stringBufferOutput = await stringBufferTest.test2(64, tab)
    // one 0x and 40 elts
    expect(stringBufferOutput.length).to.be.equal(2 + 40 * 64)
  })

  it('single bytesXX', async function () {
    const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
    const stringBufferOutput = await stringBufferTest.test3(256, [bytes32_1], [3])
    expect(stringBufferOutput).to.be.equal('0x012345')
  })

  it('multiple bytesXX', async function () {
    const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
    const bytes32_2 = '0x6700000000000000000000000000000000000000000000000000000000000000'
    const bytes32_3 = '0x8900000000000000000000000000000000000000000000000000000000000000'
    const stringBufferOutput = await stringBufferTest.test3(256, [bytes32_1, bytes32_2, bytes32_3], [3, 1, 1])
    expect(stringBufferOutput).to.be.equal('0x0123456789')
  })

  it('overflow bytesXX', async function () {
    const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
    const bytes32_2 = '0x6700000000000000000000000000000000000000000000000000000000000000'
    const bytes32_3 = '0x8900000000000000000000000000000000000000000000000000000000000000'
    // a short buffer
    const stringBufferOutput = await stringBufferTest.test3(64, [bytes32_1, bytes32_2, bytes32_3], [30, 29, 28])
    // one 0x and 3 elts of different lengts
    expect(stringBufferOutput.length).to.be.equal(2 + 60 + 58 + 56)
  })

  it('multiple overflows bytesXX', async function () {
    const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
    const bytes32_2 = '0x6700000000000000000000000000000000000000000000000000000000000000'
    const bytes32_3 = '0x8900000000000000000000000000000000000000000000000000000000000000'
    const tab = []
    const lengths = []
    for (let i = 0 ; i < 10 ; i ++) {
      tab[3*i] = bytes32_1
      tab[3*i + 1] = bytes32_2
      tab[3*i + 2] = bytes32_3
      lengths[3*i] = 30
      lengths[3*i + 1] = 29
      lengths[3*i + 2] = 28
    }
    // a short buffer
    const stringBufferOutput = await stringBufferTest.test3(64, tab, lengths)
    // one 0x and 30 elts of different lengts
    expect(stringBufferOutput.length).to.be.equal(2 + 10 * (60 + 58 + 56))
  })

  it('mixed appends', async function () {
    const string1 = '0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    const string2 = '0x22222222222222222222222222222222222222222222222222222222222222222222222222222222222222'
    const string3 = '0x33333333333333333333333333333333333333333333333333333333333333333333333333333333333333'
    const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
    const bytes32_2 = '0x6700000000000000000000000000000000000000000000000000000000000000'
    const bytes32_3 = '0x8900000000000000000000000000000000000000000000000000000000000000'
    const stringBufferOutput = await stringBufferTest.test4(62, [string1, string2, string3], [bytes32_1, bytes32_2, bytes32_3], [bytes32_1, bytes32_2, bytes32_3], [30, 29, 28])
    // one 0x and 3 strings and 3 bytes32 and 3 bytesXX of differnt length
    expect(stringBufferOutput.length).to.be.equal(2 + 3 * 86 + 3 * 64 + 60 + 58 + 56)
  })

  describe('Benchmarks', function () {
    it('short strings', async function () {
      const gasUsage = await stringBufferTest.benchmark1(256, [0x012345, 0x67, 0x89])
      console.log("short strings benchmark", gasUsage.toNumber())
    })

    it('long strings', async function () {
      const string1 = '0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
      const string2 = '0x22222222222222222222222222222222222222222222222222222222222222222222222222222222222222'
      const gasUsage = await stringBufferTest.benchmark1(256, [string1, string2])
      console.log("long strings benchmark", gasUsage.toNumber())
    })

    it('multiple bytes32', async function () {
      const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
      const bytes32_2 = '0x6700000000000000000000000000000000000000000000000000000000000000'
      const bytes32_3 = '0x8900000000000000000000000000000000000000000000000000000000000000'
      const gasUsage = await stringBufferTest.benchmark2(256, [bytes32_1, bytes32_2, bytes32_3])
      console.log("multiple bytes32 benchmark", gasUsage.toNumber())
    })

    it('multiple bytesXX', async function () {
      const bytes32_1 = '0x0123450000000000000000000000000000000000000000000000000000000000'
      const bytes32_2 = '0x6700000000000000000000000000000000000000000000000000000000000000'
      const bytes32_3 = '0x8900000000000000000000000000000000000000000000000000000000000000'
      const gasUsage = await stringBufferTest.benchmark3(256, [bytes32_1, bytes32_2, bytes32_3], [3, 1, 1])
      console.log("multiple bytesXX benchmark", gasUsage.toNumber())
    })

    it('compare benchmark', async function () {
      const string1 = '0x616263646566'
      const string2 = '0x626263646566'
      const string3 = '0x636263646566'
      const string4 = '0x646263646566'
      const string5 = '0x656263646566'
      const tab = Array(4).fill([string1, string2, string3, string4, string5]).flat() // 21 elts
      const [gasUsage1, gasUsage2] = await stringBufferTest.benchmark4(1024, tab)
      console.log("compare benchmark", gasUsage1.toNumber(), gasUsage2.toNumber())
    })
  })

})
