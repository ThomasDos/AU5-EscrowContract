const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('PublicSale', () => {
  async function deployPublicSale() {
    const price = ethers.utils.parseEther('1')
    const description = 'PublicSale contract'
    // Contracts are deployed using the first signer/account by default
    const [owner, ...signers] = await ethers.getSigners()

    const PublicSale = await ethers.getContractFactory('PublicSale')
    const publicSale = await PublicSale.deploy(price, description)

    return { publicSale, owner, signers, price, description }
  }
  describe('Deployement', () => {
    it('should deploy', async () => {
      const { publicSale } = await deployPublicSale()
      expect(publicSale.address).to.properAddress
    })

    it('should have the correct description', async () => {
      const { publicSale, description } = await deployPublicSale()
      expect(await publicSale.description()).to.equal(description)
    })

    it('should have the correct price', async () => {
      const { publicSale, price } = await deployPublicSale()
      expect(await publicSale.price()).to.equal(price)
    })

    it('should have the correct owner', async () => {
      const { publicSale, owner } = await deployPublicSale()
      expect(await publicSale.owner()).to.equal(owner.address)
    })
  })

  describe('Interaction', () => {
    it('should update the price', async () => {
      const { publicSale } = await deployPublicSale()
      const newPrice = ethers.utils.parseEther('2')
      await publicSale.updatePrice(newPrice)
      expect(await publicSale.price()).to.equal(newPrice)
    })

    it('should update the description', async () => {
      const { publicSale } = await deployPublicSale()
      const newDescription = 'New description'
      await publicSale.updateDescription(newDescription)
      expect(await publicSale.description()).to.equal(newDescription)
    })

    it('should not allow non-owners to update the price', async () => {
      const { publicSale, signers } = await deployPublicSale()
      const newPrice = ethers.utils.parseEther('2')
      await expect(publicSale.connect(signers[0]).updatePrice(newPrice)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
    })

    it('should not allow non-owners to update the description', async () => {
      const { publicSale, signers } = await deployPublicSale()
      const newDescription = 'New description'
      await expect(publicSale.connect(signers[0]).updateDescription(newDescription)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
    })

    it('should allow anyone to buy, transfer the value to the original owner and transfer ownership to the new buyer', async () => {
      const { publicSale, signers, price, owner } = await deployPublicSale()
      const originalBalance = await ethers.provider.getBalance(owner.address)
      await publicSale.connect(signers[1]).buy({ value: price })
      expect(await ethers.provider.getBalance(owner.address)).to.be.gt(originalBalance)
      expect(await publicSale.owner()).to.equal(signers[1].address)
    })

    it('should not allow anyone to buy if the price is not met', async () => {
      const { publicSale, signers, price, owner } = await deployPublicSale()
      await expect(publicSale.connect(signers[1]).buy({ value: price.sub(1) })).to.be.revertedWith('Wrong price')
    })

    it('should not allow anyone to buy if the contract is already owned', async () => {
      const { publicSale, signers, price, owner } = await deployPublicSale()
      await publicSale.connect(signers[1]).buy({ value: price })
      await expect(publicSale.connect(signers[2]).buy({ value: price })).to.be.revertedWith('Item is already sold')
    })
  })
})
