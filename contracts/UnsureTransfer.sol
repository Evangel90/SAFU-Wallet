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

    mapping(address => Transaction) public transactions;

    address payable receiver;

    event UnsureTransferInitiated(address sender, address receiver, uint amount);
    event ConfirmationStringProvided(address receiver);
    event TransferConfirmed(address sender, address receiver, uint amount);
    event TransferCancelled(address sender, address receiver, uint amount);

    function intiateUnsureTransfer(address payable _receiver) external payable {
        require(msg.value > 0, "Amount must be greater than 0");

        transactions[_receiver] = Transaction({
            sender: payable(msg.sender),
            receiver: _receiver,
            amount: msg.value,
            confirmationString: "",
            confirmedBySender: false,
            confirmedByReceiver: false
        });

        emit UnsureTransferInitiated(msg.sender, _receiver, msg.value);
    }

    function confirmationStringProvider(string calldata _confirmationString) external{
        Transaction storage initialTransaction = transactions[msg.sender];
        // require(initialTransaction.receiver == msg.sender, "You are not the receiver");
        require(initialTransaction.sender != address(0), "No escrow found");
        require(bytes(_confirmationString).length > 0, "Purpose cannot be empty");

        initialTransaction.confirmationString = _confirmationString;
        initialTransaction.confirmedByReceiver = true;

        emit ConfirmationStringProvided(msg.sender);
    }

    function confirmTransfer() external{
        Transaction storage initialTransaction = transactions[receiver];
        require(initialTransaction.sender == msg.sender, "You are not the sender");
        require(initialTransaction.confirmedByReceiver, "Receiver has not confirmed the transaction");

        initialTransaction.confirmedBySender = true;

        receiver.transfer(initialTransaction.amount);

        emit TransferConfirmed(msg.sender, receiver, initialTransaction.amount);

        delete transactions[receiver];
    }

    function cancelTransaction() external{
        Transaction storage initialTransaction = transactions[receiver];
        require(initialTransaction.sender == msg.sender, "Only sender can cancel");

        uint amountToRefund = initialTransaction.amount;
        initialTransaction.sender.transfer(amountToRefund);

        emit TransferCancelled(msg.sender, receiver, amountToRefund);

        delete transactions[receiver];
    }
    
}
