import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { hardhat } from 'viem/chains'
import { WagmiConfig, configureChains, createConfig, sepolia } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient, webSocketPublicClient } = configureChains([hardhat, sepolia], [publicProvider()])

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [new MetaMaskConnector({ chains })]
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
      <Toaster />
    </WagmiConfig>
  )
}
