import { useState, useEffect } from 'react'
import { Stack, Input, Button, Spinner } from '@chakra-ui/react'
import { unsureTransferInit } from '../utils/utils'

function UnsureTransfer({ clicked, privateKey }) {
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

    const handleUnsureTransfer = async () => {
        setIsLoading(true)
        await unsureTransferInit(privateKey, recipientAddress, amount)
        setIsLoading(false)
    }

    return (
        <>
            {clicked && (
                <Stack mt='2rem' spacing={4} align='center'>
                    <Input placeholder='Enter Recipient Address' onChange={handleAddressInput} />
                    <Input placeholder='Enter Amount in ETH' onChange={handleAmountInput} />
                    <Button colorScheme='teal' size='lg' onClick={handleUnsureTransfer} isDisabled={isLoading}>
                        {isLoading ? <Spinner size='sm' /> : 'Initiate Unsure Transfer'}
                    </Button>
                </Stack>
            )}
        </>
    )
}

export default UnsureTransfer