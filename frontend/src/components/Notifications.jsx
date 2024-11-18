import { Accordion, AccordionButton, AccordionIcon, AccordionPanel, AccordionItem, Box, Button, InputGroup, Input, InputRightElement, Stack, Text, ButtonGroup } from "@chakra-ui/react";
import { replyUnsureTransfer, getContract, cancelUnsureTransfer, confirmUnsureTransfer } from "../utils/utils";
import { useState, useEffect } from "react";
import { ethers } from "ethers"

function Notifications({ clicked, privateKey, unsureTF, account }) {
    const [txData, setTxData] = useState({})
    const [itSender, setItSender] = useState()
    const [itReceiver, setItReceiver] = useState()
    const [confirmationString, setConfirmationString] = useState()
    const [stringProvided, setStringProvided] = useState()

    useEffect(() => {
        console.log('inside useEffect')
        const UnsureTransferContract = getContract(privateKey)

        UnsureTransferContract.on("UnsureTransferInitiated", (sender, receiver, value, event) => {
            let txEvent = {
                sender: sender,
                receiver: receiver,
                value: value,
                eventData: event
            }

            if (account.address.toLowerCase() === sender.toLowerCase()) {
                setItSender(true)
            } else if (account.address.toLowerCase() === receiver.toLowerCase()) {
                setItReceiver(true)
            }
            setTxData(txEvent)
        })

        UnsureTransferContract.on("ConfirmationStringProvided", (sender, confirmedString, event) => {
            setStringProvided(true)
            setConfirmationString(confirmedString)
            console.log('Confirmation String Provided', sender, confirmedString)
        })

        return () => {
            UnsureTransferContract.removeAllListeners()
        }
    }, [unsureTF, account.address])

    const handleStringInput = (e) => {
        setConfirmationString(e.target.value)
    }

    const handleReply = async() => {
        try {
            console.log('...replying')
            await replyUnsureTransfer(privateKey, confirmationString)
        } catch (error) {
            console.error('Reply error:', error)
        }
    }

    const handleCancel = async() => {
        try {
            await cancelUnsureTransfer(privateKey)
            setItSender(false)
            setItReceiver(false)
            setStringProvided(false)
            setConfirmationString('')
            setTxData({})
        } catch (error) {
            console.error('Cancel error:', error)
        }
    }

    const handleConfirmTransaction = async() => {
        try {
            await confirmUnsureTransfer(privateKey)
            setItSender(false)
            setItReceiver(false)
            setStringProvided(false)
            setConfirmationString('')
            setTxData({})
        } catch (error) {
            console.error('Confirmation error:', error)
        }
    }

    return (
        <>
            {clicked && (txData.value || itSender || itReceiver) && (
                <Accordion mt='2rem' allowToggle defaultIndex={[0]}>
                    <AccordionItem textAlign='left'>
                        <h2>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left'>
                                    Unsure Transfer Status
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        {itSender && (
                            <AccordionPanel pb={4}>
                                <Stack spacing={4}>
                                    <Text>{`You have initiated an 'Unsure Transfer' of ${txData.value ? ethers.formatEther(txData.value) : '0'} ETH to ${txData.receiver}`}</Text>
                                    {stringProvided ? (
                                        <>
                                            <Text>{`Receiver provided confirmation string: ${confirmationString}`}</Text>
                                            <ButtonGroup spacing={4}>
                                                <Button colorScheme='green' onClick={handleConfirmTransaction}>
                                                    Confirm Transaction
                                                </Button>
                                                <Button colorScheme='red' onClick={handleCancel}>
                                                    Cancel Transaction
                                                </Button>
                                            </ButtonGroup>
                                        </>
                                    ) : (
                                        <Button colorScheme='red' onClick={handleCancel}>
                                            Cancel Transfer
                                        </Button>
                                    )}
                                </Stack>
                            </AccordionPanel>
                        )}
                        {itReceiver && (
                            <AccordionPanel pb={4}>
                                <Stack spacing={4}>
                                    <Text>{`Incoming 'Unsure Transfer' of ${txData.value ? ethers.formatEther(txData.value) : '0'} ETH from ${txData.sender}`}</Text>
                                    {!stringProvided && (
                                        <InputGroup size='md'>
                                            <Input
                                                pr='4.5rem'
                                                type='text'
                                                placeholder='Enter Confirmation String'
                                                onChange={handleStringInput}
                                            />
                                            <InputRightElement width='4.5rem'>
                                                <Button h='1.75rem' size='sm' colorScheme="green" onClick={handleReply}>
                                                    Reply
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    )}
                                    {stringProvided && (
                                        <Text color='green.500'>{`Confirmation string provided: ${confirmationString}`}</Text>
                                    )}
                                </Stack>
                            </AccordionPanel>
                        )}
                    </AccordionItem>
                </Accordion>
            )}
        </>
    )
}

export default Notifications