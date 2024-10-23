const { ethers } = require("hardhat")
require('dotenv').config();

const contractAddr = process.env.CONTRACT_ADDRESS
const contractName = "UnsureTransfer"

const receiverAdd = process.env.RECIPIENT_ADDRESS


const initiateTransfer = async () => {
    const accounts = await ethers.getSigners()
    const senderAccount = accounts[0]
    const contract = await ethers.getContractAt(contractName, contractAddr, senderAccount);

    contract.on("UnsureTransferInitiated", (sender, receiver, value) => {
        console.log(`Transfer initiated from ${sender} to ${receiver} with value ${value}`)
    })

    const transferInit = await contract.initiateUnsureTransfer(receiverAdd, {value: ethers.parseEther("3")})
    await transferInit.wait()

    console.log(`Transfer initiated successfully`)
}

initiateTransfer()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
