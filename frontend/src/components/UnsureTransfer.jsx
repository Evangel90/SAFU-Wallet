import { useState } from 'react'
import { Stack, Input, Button } from '@chakra-ui/react'
import { unsureTransferInit } from '../utils/utils'

function UnsureTransfer({clicked, account, privateKey}){
    const[recipientAddress, setRecipientAddress] = useState('') 
    const[amount, setAmount] = useState('')

    const handleAddressInput = (e) => {
        setRecipientAddress(e.target.value)
    }

    const handleAmountInput = (e) => {
        setAmount(e.target.value)
        console.log(recipientAddress, e.target.value)
    }

    const handleUnsureTransfer = () =>{
        unsureTransferInit(privateKey, recipientAddress, amount)

    }


    return (
        <>
            {clicked && (
                <Stack spacing={4} direction='row' align='center'>
                    <Input placeholder='Enter Recipient Address' onChange={handleAddressInput} />
                    <Input placeholder='Enter Amount' onChange={handleAmountInput}/>
                    <Button colorScheme='teal' onClick={handleUnsureTransfer}>Unsure Tf</Button>
                </Stack>
            )}
        </>     
    )
}

export default UnsureTransfer