const { ethers } = require("hardhat")
require('dotenv').config();

const contractAddr = process.env.CONTRACT_ADDRESS
const contractName = "UnsureTransfer"

const cancelTransfer = async () => {
    const accounts = await ethers.getSigners()
    const senderAccount = accounts[0]
    
    const contract = await ethers.getContractAt(contractName, contractAddr, senderAccount);
    
    contract.on("TransferCancelled", (sender, receiver, amount) => {
        console.log(`Cancelled! The transfer of from ${sender} to ${receiver} with amount ${amount} has been cancelled`)
    })

    const confirmation = await contract.confirmTransfer()
    await confirmation.wait()
    
    console.log(`Transfer Cancelled`)
}

cancelTransfer()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
