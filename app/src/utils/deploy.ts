import { ethers } from 'ethers'
import { HexString } from 'ethers/lib.commonjs/utils/data'
import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json'

export default async function deploy(signer: any, arbiter: HexString, beneficiary: HexString, value: number) {
  const factory = new ethers.ContractFactory(Escrow.abi, Escrow.bytecode, signer)
  const contract = await factory.deploy(arbiter, beneficiary, { value })
  return contract
}
