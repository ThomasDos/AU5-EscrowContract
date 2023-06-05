import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json'
export default async function useApprove(contractAddress: `0x${string}`) {
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: Escrow.abi,
    functionName: 'approve'
  })

  const { data, write } = useContractWrite(config)

  return { data, write }
}
