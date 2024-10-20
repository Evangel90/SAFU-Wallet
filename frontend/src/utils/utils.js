import { ethers, JsonRpcProvider } from "ethers"
import { abi } from '../../../artifacts/contracts/UnsureTransfer.sol/UnsureTransfer.json'

const provider = new JsonRpcProvider("https://eth-holesky.g.alchemy.com/v2/jieawsXv4jXd1QLvQ6R500Nty_qryZVm")
const contractAddress = '0x6A40Efcce5f3D73c7b2Ed8F9c75a101438fa1Fa6'
// const contractName = "UnsureTransfer"
// const contractAbi = require('../../../artifacts/contracts/UnsureTransfer.sol/UnsureTransfer.json').abi



export function generateAccount(privateKey){
    let wallet
    if(privateKey === ""){
        console.log('reached if')
        wallet = ethers.Wallet.createRandom()
        console.log(wallet.mnemonic)
        console.log(wallet.address)
        
    }else{
        wallet = new ethers.Wallet(privateKey)
        console.log(wallet.address)
    }

    return wallet
}

export async function getAccountBalance(address){
    const balance = await provider.getBalance(address)
    return ethers.formatEther(balance)
}

export async function transferFunds(_privateKey, receiver, amount){
    const wallet = new ethers.Wallet(_privateKey, provider)
    const signer= wallet.connect(provider)
    console.log(signer)
    try{
        const tx = {
            to: receiver,
            value: ethers.parseEther(amount)
        }
        
        const transferFunds = await signer.sendTransaction(tx)
        // const transferFunds = await transferingFunds

        // return transferFunds
        console.log(transferFunds)

    }catch(err){
        console.log('Transfer err', err)
    }
    

}


export async function unsureTransferInit(_privateKey, receiverAddress, amount){
    const wallet = new ethers.Wallet(_privateKey, provider)
    const signer= wallet.connect(provider)
    const UnsureTransferContract = new ethers.Contract(contractAddress, abi, signer )

    const txInit = await UnsureTransferContract.initiateUnsureTransfer(
        receiverAddress, 
        {value: ethers.parseEther(amount)}
    )
    txInit.wait()

    console.log('Success', txInit)
}



// generateAccount('3defcecedc324b81919c2b6a12c1cd26b36df488fee1feddcb47dbea9901cde4')

