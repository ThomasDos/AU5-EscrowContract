import publicSaleContractConfigs from '@/utils/publicSaleContractConfigs'
import { waitForTransaction } from '@wagmi/core'
import { useState } from 'react'
import { useContractEvent, useContractRead, useNetwork, useWalletClient } from 'wagmi'

export default function PublicSaleContract({ address, description, value }: any) {
  const { data: walletClient } = useWalletClient()
  const { chain } = useNetwork()
  const [isLoading, setIsLoading] = useState(false)

  const confirmTransaction = async () => {
    try {
      const tx = await walletClient?.writeContract({
        ...publicSaleContractConfigs,
        address,
        functionName: 'buy',
        chain,
        value
      })
      setIsLoading(true)
      await waitForTransaction({ hash: tx as `0x${string}` })
      setIsLoading(false)
    } catch (error) {}
  }

  const handleItemAvailable = async () => {
    try {
      const tx = await walletClient?.writeContract({
        ...publicSaleContractConfigs,
        address,
        functionName: 'updateIsSold',
        chain,
        args: [false]
      })
      setIsLoading(true)
      await waitForTransaction({ hash: tx as `0x${string}` })
      setIsLoading(false)
    } catch (error) {}
  }

  const { data: isSold, refetch: refetchIsSold } = useContractRead({
    ...publicSaleContractConfigs,
    address,
    functionName: 'isSold'
  })

  const { data: owner, refetch: refetchOwner } = useContractRead({
    ...publicSaleContractConfigs,
    address,
    functionName: 'owner'
  })

  useContractEvent({
    ...publicSaleContractConfigs,
    address,
    eventName: 'PurchaseConfirmed',
    listener: () => {
      refetchIsSold()
      refetchOwner()
    }
  })

  useContractEvent({
    ...publicSaleContractConfigs,
    address,
    eventName: 'IsSoldUpdated',
    listener: () => {
      refetchIsSold()
    }
  })

  const isOwner = walletClient?.account.address === owner

  return (
    <div className='border p-4 my-4'>
      <ul>
        <li>Owner : {isOwner ? 'You are the owner 😎' : (owner as string)}</li>
        <li>Price : {value / 10 ** 18} eth</li>
        <li>Status : {isSold ? "It's been sold! ✅" : 'Its available... ⏰'}</li>
        <li>Description : {description}</li>

        {!!isSold && !!isOwner && (
          <button
            onClick={handleItemAvailable}
            className='flex mx-auto font-bold text-blue-600 hover:underline border border-blue-600 hover:bg-blue-600 hover:text-white rounded hover:border-none p-2 my-4'
            disabled={isLoading}
          >
            {isLoading ? 'Transaction is processing...' : `Make ${description} available to buy 🚀`}
          </button>
        )}
        {!isSold && !isOwner && (
          <button
            onClick={confirmTransaction}
            className='flex mx-auto font-bold text-blue-600 hover:underline border border-blue-600 hover:bg-blue-600 hover:text-white rounded hover:border-none p-2 my-4'
            disabled={isLoading}
          >
            {isLoading ? 'Transaction is processing...' : `Buy ${description} 🚀`}
          </button>
        )}
      </ul>
    </div>
  )
}
