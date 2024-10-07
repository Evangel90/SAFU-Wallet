const { ethers } = require("hardhat")
require('dotenv').config();

const contractAddr = process.env.CONTRACT_ADDRESS
const contractName = "UnsureTransfer"

const confirmTransfer = async () => {
    const accounts = await ethers.getSigners()
    const senderAccount = accounts[0]
    const contract = await ethers.getContractAt(contractName, contractAddr, senderAccount);
    
    contract.on("TransferConfirmed", (sender, receiver, amount) => {
        console.log(`The transfer of from ${sender} to ${receiver} with amount ${amount} has been confirmed`)
    })

    const confirmation = await contract.confirmTransfer()
    await confirmation.wait()
    
    console.log(`Transfer confirmed successfully`)
}

confirmTransfer()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
