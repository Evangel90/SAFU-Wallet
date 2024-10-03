const { ethers } = require("hardhat")
require('dotenv').config();

const contractAddr = process.env.CONTRACT_ADDRESS
const contractName = "UnsureTransfer"

const receiverAdd = process.env.RECIPIENT_ADDRESS

async function main() {
    const accounts = await ethers.getSigners()

    let senderAccount =  accounts[0]
    let receiverAccount =  accounts[1]

    const contract = await ethers.getContractAt(contractName, contractAddr, senderAccount);
    // const valueInEth = ethers.parseEther("2")

    // const initiateTransaction = await contract.initiateUnsureTransfer(receiverAdd, {value: valueInEth})
    // const confirmationString = await contract.confirmationStringProvider('State government tax')
    const confirmTransfer = await contract.confirmTransfer()
    // const cancelTnx = await contract.cancelTransaction()

    // await initiateTransaction.wait()
    // await confirmationString.wait()
    await confirmTransfer.wait()
    // await cancelTnx.wait()

    // console.log(`Transaction initiated successfully with value: ${valueInEth} ETH`)
    // console.log(`Confirmation string has been provided`)
    console.log(`Transfer has been confirmed successfully`)
    // console.log(`Transaction cancelled successfully`)

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });