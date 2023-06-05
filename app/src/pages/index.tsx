import EscrowContract from '@/components/EscrowContract'
import PublicSaleContract from '@/components/PublicSaleContract'
import escrowContractConfigs from '@/utils/escrowContractConfigs'
import publicSaleContractConfigs from '@/utils/publicSaleContractConfigs'
import { waitForTransaction } from '@wagmi/core'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { useAccount, useConnect, useDisconnect, useNetwork, usePublicClient, useWalletClient } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

const StyledInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  margin: 5px;
`

function Home() {
  const { chain, chains } = useNetwork()
  const [escrows, setEscrows] = useState<{}[]>([])
  const [escrowEth, setEscrowEth] = useState(0.001)
  const [publicSales, setPublicSales] = useState<{}[]>([])
  const [publicSaleEth, setPublicSaleEth] = useState(0.001)
  const [publicSaleDescription, setPublicSaleDescription] = useState('')
  const [arbiter, setArbiter] = useState('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
  const [beneficiary, setBeneficiary] = useState('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
  const { connect } = useConnect({
    connector: new MetaMaskConnector({ chains })
  })
  const { address, isConnected } = useAccount()
  const { getTransactionReceipt } = usePublicClient()

  const { disconnect } = useDisconnect()
  const { data: walletClient } = useWalletClient({ chainId: chain?.id })

  useEffect(() => {
    connect()
  }, [])

  async function newEscrowContract() {
    if (!walletClient || !arbiter || !beneficiary || !escrowEth) return
    if (
      walletClient.account.address === arbiter ||
      walletClient.account.address === beneficiary ||
      beneficiary === arbiter
    )
      return toast.error('Arbiter, Depositor or Beneficiary cannot be the same address')

    const value = escrowEth * 10 ** 18
    try {
      const contract = await walletClient.deployContract({
        ...escrowContractConfigs,
        chain,
        args: [arbiter, beneficiary],
        //@ts-ignore
        value
      })

      const receipt = await getTransactionReceipt({ hash: contract })

      const escrow = {
        address: receipt.contractAddress,
        arbiter,
        beneficiary,
        value: value
      }

      setEscrows([...escrows, escrow])
    } catch (error) {
      console.log('error', error)
    }
  }

  const newPublicSaleContract = async () => {
    if (!walletClient || !publicSaleDescription || !publicSaleEth) return
    const value = publicSaleEth * 10 ** 18
    try {
      const transaction = await walletClient.deployContract({
        ...publicSaleContractConfigs,
        chain,
        args: [value, publicSaleDescription]
      })

      const contract = await waitForTransaction({ hash: transaction })

      const publicSale = {
        address: contract.contractAddress,
        description: publicSaleDescription,
        value: value
      }

      setPublicSales([...publicSales, publicSale])
    } catch (error) {
      console.log('error', error)
    }
  }

  if (!isConnected) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <button
          onClick={() => connect()}
          className='p-5 border hover:bg-gray-300 hover:text-white text-lg rounded hover:border-none'
        >
          Connect
        </button>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='flex justify-between w-full'>
        <button onClick={() => disconnect()}>Disconnect</button>
        <div>{address}</div>
      </div>
      <div className='contract flex flex-col w-full px-10'>
        <h1 className='text-center text-xl font-bold my-10'> New Contract </h1>
        <div className='flex justify-center gap-10 w-full'>
          <div>
            <h2 className='font-bold text-center text-lg'>Escrow Contract</h2>
            <div className='flex items-center justify-between'>
              <label>Arbiter Address</label>
              <StyledInput type='text' value={arbiter} onChange={(e) => setArbiter(e.target.value)} />
            </div>

            <div className='flex items-center justify-between'>
              <label>Beneficiary Address</label>
              <StyledInput type='text' value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} />
            </div>
            <div className='flex items-center justify-between'>
              <label>Deposit Amount (in Eth)</label>
              <StyledInput type='number' value={escrowEth} onChange={(e) => setEscrowEth(Number(e.target.value))} />
            </div>

            <button
              className='border hover:border-none p-4 mt-4 hover:bg-gray-500 hover:text-white'
              onClick={newEscrowContract}
            >
              Deploy
            </button>
          </div>
          <div>
            <h2 className='font-bold text-center text-lg'>Public Sale Contract</h2>
            <div className='flex items-center justify-between'>
              <label>Deposit Amount (in Eth)</label>
              <StyledInput
                type='number'
                value={publicSaleEth}
                onChange={(e) => setPublicSaleEth(Number(e.target.value))}
              />
            </div>
            <div className='flex items-center justify-between'>
              <label>Description</label>
              <StyledInput
                type='text'
                value={publicSaleDescription}
                onChange={(e) => setPublicSaleDescription(e.target.value)}
              />
            </div>
            <button
              className='border hover:border-none p-4 mt-4 hover:bg-gray-500 hover:text-white'
              onClick={newPublicSaleContract}
            >
              Deploy
            </button>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <h1 className='text-xl font-bold text-center'> Existing Contracts </h1>
        <div className='flex justify-center gap-10'>
          <div>
            {escrows.map((escrow: any) => {
              return <EscrowContract key={escrow.address} {...escrow} />
            })}
          </div>
          <div>
            {publicSales.map((publicSale: any) => {
              return <PublicSaleContract key={publicSale.address} {...publicSale} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
