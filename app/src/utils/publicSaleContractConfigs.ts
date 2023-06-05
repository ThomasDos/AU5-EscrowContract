import PublicSale from '../artifacts/contracts/PublicSale.sol/PublicSale.json'

const publicSaleContractConfigs = {
  abi: PublicSale.abi,
  bytecode: PublicSale.bytecode as `0x${string}`
}

export default publicSaleContractConfigs
