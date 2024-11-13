import { Accordion, AccordionButton, AccordionIcon, AccordionPanel, AccordionItem, Box, Button, InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { replyUnsureTransfer, getContract, cancelUnsureTransfer } from "../utils/utils";
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

            console.log("Done listening", txEvent)
            console.log('.....')

            if (account.address == txEvent.sender) {
                setItSender(true)
            } else if (account.address == txEvent.receiver) {
                setItReceiver(true)
            }
            setTxData(txEvent)
        })

        UnsureTransferContract.on("ConfirmationStringProvided", (sender, event) => {
            setStringProvided(true)
            console.log('Confirmation String Provided', sender, event)
        })
    }, [unsureTF])

    const handleStringInput = (e) => {
        setConfirmationString(e.target.value)
    }

    const handleReply = async() => {
        console.log('...replying')
        await replyUnsureTransfer(privateKey, confirmationString)
    }

    const handleCancel = async() => {
        await cancelUnsureTransfer(privateKey)
    }

    return (
        <>
            {clicked && (
                <Accordion mt='2rem' allowToggle>
                    <AccordionItem textAlign='left'>
                        <h2>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left'>
                                    Unsure Transfer Initiated
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        {itSender && (
                            <>
                                <AccordionPanel pb={4}>
                                    {`You have successfully initiated an 'Unsure Transfer' of ${ethers.formatEther(txData.value)} Eth to ${txData.receiver}`}
                                    <Button colorScheme='red' onClick={handleCancel}>Cancel Unsure Transfer</Button>
                                </AccordionPanel>
                            </>
                        )}
                        {itReceiver && (
                            <AccordionPanel pb={4}>
                                {`An 'Unsure Transfer' of ${ethers.formatEther(txData.value)} Eth has just been sent to your account, provide confirmation string below to complete transaction`}
                                <InputGroup size='md'>
                                    <Input
                                        pr='4.5rem'
                                        type={'text'}
                                        placeholder='Enter Confirmation String'
                                        onChange={handleStringInput}
                                    />
                                    <div>{`The value of the string is ${confirmationString}`}</div>
                                    <InputRightElement width='4.5rem'>
                                        <Button h='1.75rem' size='sm' colorScheme="green" onClick={handleReply}>Reply</Button>
                                    </InputRightElement>
                                </InputGroup>
                            </AccordionPanel>
                        )}
                        {stringProvided && itReceiver && (
                            <AccordionPanel pb={4}>
                                {`You have successfully provided a confirmation string of '${confirmationString}'`}
                            </AccordionPanel>
                        )}
                        {stringProvided && itSender && (
                            <AccordionPanel pb={4}>
                                {`The confirmation string of value '${confirmationString}' has been provided by the receiver`}
                            </AccordionPanel>
                        )}
                    </AccordionItem>
                </Accordion>
            )}

        </>
    )
}

export default Notifications