const { ethers } = require("hardhat")

const contractAddr = "0xd12A1924617e5342B7f0eEdD39a9f8B7f609D9e4"
const contractName = "UnsureTransfer"

const accounts = ethers.getSigners()
// const senderAccount = accounts[0]
const receiverAccount = accounts[1]

const receiverAdd = "0x19F9bC5c623aba77B18f5834598A1356c6ee5c27"



async function main() {
    const contract = await ethers.getContractAt(contractName, contractAddr, secondAccount);
    const valueInEth = ethers.parseEther("0.01")

    const initiateTransaction = await contract.intiateUnsureTransfer(receiverAdd, {value: valueInEth})
    

    await initiateTransaction.wait()
    console.log(`Transaction initiated with value of ${valueInEth} ETH`)

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });