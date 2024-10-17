import { ethers, JsonRpcProvider } from "ethers"

const provider = new JsonRpcProvider("https://eth-holesky.g.alchemy.com/v2/jieawsXv4jXd1QLvQ6R500Nty_qryZVm")
// let account

let wallet
export function generateAccount(privateKey){
    if(privateKey === ""){
        console.log('reached if')
        wallet = ethers.Wallet.createRandom()
        console.log(wallet.mnemonic)
        console.log(wallet.address)
        
    }else{
        wallet = new ethers.Wallet(privateKey)
        console.log(wallet.address)
    }

    // account = wallet
    return wallet
}

export async function getAccountBalance(address){
    const balance = await provider.getBalance(address)
    return ethers.formatEther(balance)
}

export async function transferFunds(receiver, amount){
    try{
        const tx = {
            to: receiver,
            value: ethers.parseEther(amount)
        }
    
        const transferingFunds = await wallet.sendTransaction(tx)
        const transferFunds = await transferingFunds.wait()

        // return transferFunds
        console.log(transferFunds)

    }catch(err){
        console.log('Transfer err', err)
    }
    
}

// generateAccount('3defcecedc324b81919c2b6a12c1cd26b36df488fee1feddcb47dbea9901cde4')

