import { useState } from 'react'
import { Stack, Input, Button, Spinner } from '@chakra-ui/react'
import { transferFunds } from '../utils/utils'

function Transfer({ clicked, privateKey }) {
    const [recipientAddress, setRecipientAddress] = useState('') 
    const [amount, setAmount] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const handleAddressInput = (e) => {
        setRecipientAddress(e.target.value)
    }
    
    const handleAmountInput = (e) => {
        setAmount(e.target.value)
        console.log(recipientAddress, e.target.value)
    }

    const handleTransfer = async() => {
        setIsLoading(true)
        await transferFunds(privateKey, recipientAddress, amount)
        setIsLoading(false)
    }

    return (
        <>
            {clicked && (
                <Stack mt='2rem' spacing={4} align='center'>
                    <Input placeholder='Enter Recipient Address' onChange={handleAddressInput} />
                    <Input placeholder='Enter Amount in ETH' onChange={handleAmountInput}/>
                    <Button colorScheme='teal' size='lg' onClick={handleTransfer} isDisabled={isLoading}>
                        {isLoading ? <Spinner size='sm' /> : 'Transfer'}
                    </Button>
                </Stack>
            )}
        </>
    )
}

export default Transfer