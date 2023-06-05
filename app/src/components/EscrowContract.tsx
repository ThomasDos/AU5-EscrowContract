import escrowContractConfigs from '@/utils/escrowContractConfigs'
import { useState } from 'react'
import { useContractEvent, useContractRead, useNetwork, usePublicClient, useWalletClient } from 'wagmi'

export default function EscrowContract({ address, arbiter, beneficiary, value }: any) {
  const { data: walletClient } = useWalletClient()
  const [balance, setBalance] = useState(0)
  const { chain } = useNetwork()

  const handleApprove = () => {
    walletClient?.writeContract({
      ...escrowContractConfigs,
      address,
      functionName: 'approve',
      chain
    })
  }

  const { data: isApproved, refetch } = useContractRead({
    ...escrowContractConfigs,
    address,
    functionName: 'isApproved'
  })

  const { data: depositor } = useContractRead({
    ...escrowContractConfigs,
    address,
    functionName: 'depositor'
  })

  useContractEvent({
    ...escrowContractConfigs,
    address,
    eventName: 'Approved',
    listener: () => {
      refetch()
    }
  })

  const { getBalance } = usePublicClient()
  getBalance({ address }).then((res) => {
    setBalance(Number(res))
  })

  return (
    <div className='border p-4 my-4'>
      <ul>
        <li>Depositor : {depositor as string}</li>
        <li>Arbiter : {arbiter}</li>
        <li>Beneficiary : {beneficiary}</li>
        <li>Balance : {balance / 10 ** 18} eth</li>
        <li>Status : {isApproved ? "It's been approved! ✅" : 'Waiting for approval... ⏰'}</li>
        {isApproved ? null : arbiter === walletClient?.account.address ? (
          <button
            id={address}
            onClick={handleApprove}
            className='flex mx-auto font-bold text-blue-600 hover:underline border border-blue-600 hover:bg-blue-600 hover:text-white rounded hover:border-none p-2 my-4'
          >
            Approve contract 🚀
          </button>
        ) : (
          <span className='text-red-700 font-bold'>You&apos;re not the arbiter of this contract !</span>
        )}
      </ul>
    </div>
  )
}
