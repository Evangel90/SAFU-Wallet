# SAFU Wallet

SAFU Wallet is an Ethereum wallet that allows users to transfer and receive Ether. It also includes an additional feature called "Unsure Transfer" which provides an extra layer of security for transactions.

## Features

- **Transfer Ether**: Users can transfer Ether to any Ethereum address.
- **Receive Ether**: Users can receive Ether from any Ethereum address.
- **Unsure Transfer**: This feature allows a user to transfer Ether to an address with the intent of signaling the receiver. The receiver must then send a confirmation signal back. The sender can then decide whether the signal is appropriate:
  - If the signal is deemed correct, the transaction is confirmed and the Ether is credited to the receiver's account.
  - If the signal is deemed inappropriate, the transaction can be canceled and the Ether is returned to the sender.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Evangel90/SAFU-Wallet.git    
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```
3. Navigate to frontend directory:
    ```sh
    cd SAFUwallet/frontend
    ```
4. Install frontend dependencies:
    ```sh
    npm install
    ```
## Usage

1. Start the frontend:
    ```sh
    npm run dev
    ```
2. Open your browser and navigate to `http://localhost:5173`.

## Components

### Wallet

The `Wallet` component allows users to create a new account or add an existing account using a private key.

### AccountDetails

The `AccountDetails` component displays the account details, including the address and balance. It also provides options to initiate a transfer, an unsure transfer, or view notifications.

### Transfer

The `Transfer` component allows users to transfer Ether to another address.

### UnsureTransfer

The `UnsureTransfer` component allows users to initiate an unsure transfer, where the receiver must confirm the transaction.

### Notifications

The `Notifications` component displays notifications related to unsure transfers, including the ability to confirm or cancel transactions.

## Smart Contract

The `UnsureTransfer` smart contract handles the logic for initiating, confirming, and canceling unsure transfers. It includes the following functions:

- `initiateUnsureTransfer`: Initiates an unsure transfer.
- `confirmationStringProvider`: Allows the receiver to provide a confirmation string.
- `confirmTransfer`: Confirms the transfer if the confirmation string is appropriate.
- `cancelTransaction`: Cancels the transaction and refunds the Ether to the sender.
- `getTransaction`: Retrieves the details of a transaction.

## License

This project is licensed under the MIT License.
