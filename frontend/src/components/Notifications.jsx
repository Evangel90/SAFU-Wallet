import { Accordion, AccordionButton, AccordionIcon, AccordionPanel, AccordionItem, Box, Button, InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { unsureTransferInitListener, getContract } from "../utils/utils";
import { useState, useEffect } from "react";
import { ethers } from "ethers"

function Notifications({ clicked, privateKey, unsureTF, account }) {
    const [txData, setTxData] = useState({})
    const [itSender, setItSender] = useState()
    const [itReceiver, setItReceiver] = useState()

    useEffect(() => {
        console.log('inside useEffect')
        // unsureTransferInitListener(privateKey)
        // setUTFIL(true)

        const UnsureTransferContract = getContract(privateKey)

        // console.log('Should be listening to UnsureTransferInitiated now!')

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
    }, [unsureTF])

    return (
        <>
            {clicked && (
                <Accordion mt='2rem' allowToggle>
                    <AccordionItem>
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
                                    <Button colorScheme='red'>Cancel Unsure Transfer</Button>
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
                                    />
                                    <InputRightElement width='4.5rem'>
                                        <Button h='1.75rem' size='sm'>
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </AccordionPanel>
                        )}
                    </AccordionItem>
                </Accordion>
            )}

        </>
    )
}

export default Notifications