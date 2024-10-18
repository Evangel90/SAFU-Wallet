import { useState } from 'react'
import { Stack, Input, Button } from '@chakra-ui/react'
import { transferFunds } from '../utils/utils'

function Transfer({ clicked, privateKey, updateBal }) {
    const[recipientAddress, setRecipientAddress] = useState('') 
    const[amount, setAmount] = useState('')

    const handleAddressInput = (e) => {
        setRecipientAddress(e.target.value)
    }

    const handleAmountInput = (e) => {
        setAmount(e.target.value)
        console.log(recipientAddress, e.target.value)
    }

    const handleTransfer = () => {
        transferFunds(privateKey, recipientAddress, amount)
        updateBal()
    }

    return (
        <>
            {clicked && (
                <Stack spacing={4} direction='row' align='center'>
                    <Input placeholder='Enter Recipient Address' onChange={handleAddressInput} />
                    <Input placeholder='Enter Amount in Eth' onChange={handleAmountInput}/>
                    <Button colorScheme='teal' size='lg' onClick={handleTransfer}>Transfer</Button>
                </Stack>
            )}
        </>
    )
}

export default Transfer