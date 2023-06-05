import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json'

const escrowContractConfigs = {
  abi: Escrow.abi,
  bytecode: Escrow.bytecode as `0x${string}`
}

export default escrowContractConfigs
