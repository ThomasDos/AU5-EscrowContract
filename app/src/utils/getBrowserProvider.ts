import { BrowserProvider, Eip1193Provider } from 'ethers'

declare global {
  interface Window {
    ethereum: Eip1193Provider
  }
}
function getBrowserProvider() {
  if (!window) return null
  return new BrowserProvider(window.ethereum)
}

export default getBrowserProvider
