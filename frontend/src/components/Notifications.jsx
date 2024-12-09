import { Accordion, AccordionButton, AccordionIcon, AccordionPanel, AccordionItem, Box, Button, InputGroup, Input, InputRightElement, Stack, Text, ButtonGroup } from "@chakra-ui/react";
import { replyUnsureTransfer, getContract, cancelUnsureTransfer, confirmUnsureTransfer } from "../utils/utils";
import { useState, useEffect } from "react";
import { ethers } from "ethers"

function Notifications({ clicked, setClicked, privateKey, account }) {
    const [txData, setTxData] = useState({})
    const [itSender, setItSender] = useState()
    const [itReceiver, setItReceiver] = useState()
    const [confirmationString, setConfirmationString] = useState()
    const [stringProvided, setStringProvided] = useState()
    const [txEnd, setTxEnd] = useState()

    const UnsureTransferContract = getContract(privateKey)

    useEffect(() => {
        console.log('inside useEffect - notifications')

        UnsureTransferContract.on("UnsureTransferInitiated", (sender, receiver, value, event) => {
            setTxEnd(false)
            setStringProvided(false)
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
        // UnsureTransferContract.off("UnsureTransferInitiated")

        UnsureTransferContract.on("ConfirmationStringProvided", (sender, confirmedString, event) => {
            setStringProvided(true)
            setConfirmationString(confirmedString)
            setTxEnd(false)
        })
        // UnsureTransferContract.off("ConfirmationStringProvided")

        UnsureTransferContract.on("TransferConfirmed", (sender, receiver, amount, event) => {
            setStringProvided(false)
            setTxEnd(true)
            setItReceiver(false)
            setItSender(false)
            setClicked(false)
        })
        // UnsureTransferContract.off("TransferConfirmed")

        UnsureTransferContract.on("TransferCancelled", (sender, receiver, amoutToRefund, event) => {
            setStringProvided(false)
            setTxEnd(true)
            setItReceiver(false)
            setItSender(false)
            setClicked(false)
        })
        // UnsureTransferContract.off("TransferCancelled")
        return () => {
            UnsureTransferContract.removeAllListeners()
        }
    }, [])

    const handleStringInput = (e) => {
        setConfirmationString(e.target.value)
    }

    const handleReply = async () => {
        try {
            console.log('...replying')
            await replyUnsureTransfer(privateKey, confirmationString)
        } catch (error) {
            console.error('Reply error:', error)
        }
    }

    const handleCancel = async () => {
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

    const handleConfirmTransaction = async () => {
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
            {clicked && !txData.value && (
                <p>Notifications will show here</p>
            )}
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
                                    {(stringProvided && !txEnd) ? (
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
                                    ) : !txEnd && (
                                            <Button colorScheme='red' onClick={handleCancel}>
                                                Cancel Transfer
                                            </Button>
                                        )
                                    }
                                </Stack>
                            </AccordionPanel>
                        )}
                        {itReceiver && (
                            <AccordionPanel pb={4}>
                                <Stack spacing={4}>
                                    <Text>{`Incoming 'Unsure Transfer' of ${txData.value ? ethers.formatEther(txData.value) : '0'} ETH from ${txData.sender}`}</Text>
                                    {console.log(stringProvided)}
                                    {(!stringProvided && !txEnd) && (
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