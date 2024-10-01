// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract UnsureTransfer {
    struct Transaction{
        address payable sender;
        address payable receiver;
        uint amount;
        string confirmationString;
        bool confirmedBySender;
        bool confirmedByReceiver;
    }
    
}
