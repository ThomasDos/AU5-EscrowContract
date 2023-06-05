import { JsonRpcSigner } from 'ethers'

export default async function approveEscrow(escrowContract: any, signer: JsonRpcSigner) {
  const approveTxn = await escrowContract.connect(signer).approve()
  await approveTxn.wait()
  return approveTxn
}
