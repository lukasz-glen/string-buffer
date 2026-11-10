import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('StringBufferV2Test', function () {
  let stringBufferTest

  beforeEach(async function () {
    const factory = await ethers.getContractFactory('StringBufferV2Test')
    stringBufferTest = await factory.deploy()
  })

  it('short strings', async function () {
    const stringBufferOutput = await stringBufferTest.test1(32, ['0x012345', '0x67', '0x89'])
    expect(stringBufferOutput).to.be.equal('0x0123456789')
  })

  it('long strings', async function () {
    const string1 = '0x11111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    const string2 = '0x22222222222222222222222222222222222222222222222222222222222222222222222222222222222222'
    const stringBufferOutput = await stringBufferTest.test1(32, [string1, string2])
    expect(stringBufferOutput).to.be.equal(string1 + string2.substring(2))
  })

  describe('Benchmarks', function () {
    it('compare benchmark', async function () {
      const string1 = '0x616263646566'
      const string2 = '0x626263646566'
      const string3 = '0x636263646566'
      const string4 = '0x646263646566'
      const string5 = '0x656263646566'
      const tab = Array(4).fill([string1, string2, string3, string4, string5]).flat() // 21 elts
      const [gasUsage1, gasUsage2, gasUsage3] = await stringBufferTest.benchmark4(1024, 64, tab)
      console.log("compare benchmark", gasUsage1.toNumber(), gasUsage2.toNumber(), gasUsage3.toNumber())
    })
  })
})
