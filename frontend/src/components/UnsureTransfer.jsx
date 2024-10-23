import { useState, useEffect } from 'react'
import { Stack, Input, Button, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box } from '@chakra-ui/react'
import { unsureTransferInit, unsureTransferInitListener, cancelUnsureTransfer } from '../utils/utils'

function UnsureTransfer({ clicked, privateKey, setUnsureTF, unsureTF }) {
    const [recipientAddress, setRecipientAddress] = useState('')
    const [amount, setAmount] = useState('')
    const [eventData, setEventData] = useState()

    useEffect(() => {
        // console.log('inside useEffect')
        const payload = unsureTransferInitListener(privateKey)
        setEventData(payload)

    }, [unsureTF])

    const handleAddressInput = (e) => {
        setRecipientAddress(e.target.value)
    }

    const handleAmountInput = (e) => {
        setAmount(e.target.value)
        console.log(recipientAddress, e.target.value)
    }

    const handleUnsureTransfer = async () => {
        await unsureTransferInit(privateKey, recipientAddress, amount)
        setUnsureTF(true)
        // unsureTransferInitListener(privateKey)
    }

    const handleCancelTransfer = () =>{
        cancelUnsureTransfer(privateKey)
    }


    return (
        <>
            {clicked && (
                <Stack spacing={4} direction='row' align='center'>
                    <Input placeholder='Enter Recipient Address' onChange={handleAddressInput} />
                    <Input placeholder='Enter Amount' onChange={handleAmountInput} />
                    <Button colorScheme='teal' onClick={handleUnsureTransfer}>Unsure Tf</Button>
                </Stack>
            )}
            {unsureTF && (
                <Accordion allowToggle>
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left'>
                                    Transaction Details
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            {`You have successfully initiated an unsureTransfer ${eventData}`}
                            <Button colorScheme='red' onClick={handleCancelTransfer}>Cancel Transfer</Button>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            )}
        </>
    )
}

export default UnsureTransfer