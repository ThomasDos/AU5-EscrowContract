import getBrowserProvider from '@/utils/getBrowserProvider'
import { HexString } from 'ethers/lib.commonjs/utils/data'

const provider = getBrowserProvider()

export default async function addContract(
  id: string,
  contract: any,
  arbiter: HexString,
  beneficiary: HexString,
  value: BigInt
) {
  const buttonId = `approve-${id}`

  const container = document.getElementById('container')
  container.innerHTML += createHTML(buttonId, arbiter, beneficiary, value)

  contract.on('Approved', () => {
    //ON APPROVE
  })

  document.getElementById(buttonId).addEventListener('click', async () => {
    const signer = provider.getSigner()
    await contract.connect(signer).approve()
  })
}

function createHTML(buttonId: string, arbiter: HexString, beneficiary: HexString, value: BigInt) {
  return `
    <div class="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> ${arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> ${beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> ${value} </div>
        </li>
        <div class="button" id="${buttonId}">
          Approve
        </div>
      </ul>
    </div>
  `
}
