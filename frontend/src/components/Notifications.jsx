import { 
    Accordion, AccordionButton, AccordionIcon, AccordionPanel, AccordionItem, 
    Box, Button, InputGroup, Input, InputRightElement, Stack, Text, ButtonGroup, Spinner
} from "@chakra-ui/react";
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
    const [replyLoading, setReplyLoading] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [cancelLoading, setCancelLoading] = useState(false)
    const [track, setTrack] = useState(false)
    const UnsureTransferContract = getContract(privateKey)

    let transactionRunning = false

    useEffect(() => {
        // console.log('inside useEffect - notifications')

        UnsureTransferContract.on("UnsureTransferInitiated", (sender, receiver, value, event) => {
            console.log('UnsureTransfer Initiated')
            if(transactionRunning) {
                // console.log("Transaction already running")
                return
            } 
            console.log("transaction running", transactionRunning)
            transactionRunning = true
            // console.log(" track 1")
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
                setItReceiver(false)
            } else if (account.address.toLowerCase() === receiver.toLowerCase()) {
                setItReceiver(true)
                setItSender(false)
            }
            setTxData(txEvent)
            setTrack(!track)
        })
        // UnsureTransferContract.off("UnsureTransferInitiated")

        UnsureTransferContract.on("ConfirmationStringProvided", (sender, confirmedString, event) => {
            console.log('Confirmation String Provided')
            setStringProvided(true)
            setConfirmationString(confirmedString)
            setTxEnd(false)
            setTrack(!track)

        })
        // UnsureTransferContract.off("ConfirmationStringProvided")

        UnsureTransferContract.on("TransferConfirmed", (sender, receiver, amount, event) => {
            console.log('Transfer Confirmed')
            setStringProvided(false)
            setTxEnd(true)
            setItReceiver(false)
            setItSender(false)
            setClicked(false)
            // console.log(" track 2")
            setTrack(!track)
            transactionRunning = false
        })
        // UnsureTransferContract.off("TransferConfirmed")

        UnsureTransferContract.on("TransferCancelled", (sender, receiver, amoutToRefund, event) => {
            console.log('Transfer Cancelled')
            setStringProvided(false)
            setTxEnd(true)
            setItReceiver(false)
            setItSender(false)
            setClicked(false)
            // console.log(" track 3")
            setTrack(!track)
            transactionRunning = false
        })

        console.log(`sender: ${itSender}, receiver: ${itReceiver}`)
        // UnsureTransferContract.off("TransferCancelled")
        
        // return () => {
            // }
        }, [])
        
     useEffect(() => {
        // console.log('end of useEffect - notifications' + txData)
        UnsureTransferContract.removeAllListeners()
    }, [track])

    const handleStringInput = (e) => {
        setConfirmationString(e.target.value)
    }

    const handleReply = async () => {
        try {
            // console.log('...replying')
            setReplyLoading(true)
            await replyUnsureTransfer(privateKey, confirmationString)
            setReplyLoading(false)
        } catch (error) {
            setReplyLoading(true)
            // console.error('Reply error:', error)
        }
    }

    const handleCancel = async () => {
        try {
            setCancelLoading(true)
            await cancelUnsureTransfer(privateKey)
            setCancelLoading(false)
            setItSender(false)
            setItReceiver(false)
            setStringProvided(false)
            setConfirmationString('')
            setTxData({})
        } catch (error) {
            // console.error('Cancel error:', error)
        }
    }

    const handleConfirmTransaction = async () => {
        try {
            setConfirmLoading(true)
            await confirmUnsureTransfer(privateKey)
            setConfirmLoading(false)
            setItSender(false)
            setItReceiver(false)
            setStringProvided(false)
            setConfirmationString('')
            setTxData({})
        } catch (error) {
            // console.error('Confirmation error:', error)
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
                                                    {confirmLoading ? <Spinner size='sm'/>: 'Confirm Transaction'}
                                                </Button>
                                                <Button colorScheme='red' onClick={handleCancel}>
                                                    {cancelLoading ? <Spinner size='sm'/>: 'Cancel Transaction'}
                                                </Button>
                                            </ButtonGroup>
                                        </>
                                    ) : !txEnd && (
                                            <Button colorScheme='red' onClick={handleCancel}>
                                                {cancelLoading ? <Spinner size='sm'/>: 'Cancel Transaction'}
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
                                    {/* { console.log(stringProvided)} */}
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
                                                    {replyLoading ? <Spinner size='sm' /> : 'Reply'}
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