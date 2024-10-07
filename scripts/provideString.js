const { ethers } = require("hardhat")
require('dotenv').config();

const contractAddr = process.env.CONTRACT_ADDRESS
const contractName = "UnsureTransfer"

const receiverAdd = process.env.RECIPIENT_ADDRESS

const provideString = async () => {
    const accounts = await ethers.getSigners()
    const receiverAccount = accounts[1]
    const contract = await ethers.getContractAt(contractName, contractAddr, receiverAccount);

    const transaction = await contract.getTransaction(receiverAdd)
    
    contract.on("ConfirmationStringProvided", (receiver) => {
        console.log(`Receiver ${receiver} provided ${transaction.confirmationString} as confirmation string`)
    })

    const stringProvider = await contract.confirmationStringProvider('Purchase of Arsenal')
    await stringProvider.wait()

    console.log(`Confirmation string has been provided`)
}

provideString()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
