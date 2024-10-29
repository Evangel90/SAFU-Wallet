import { Accordion, AccordionButton, AccordionIcon, AccordionPanel, AccordionItem, Box } from "@chakra-ui/react";
import { unsureTransferInitListener } from "../utils/utils";
import { useState, useEffect } from "react";

function Notifications({ clicked, privateKey, unsureTF }) {
    const [uTFIL, setUTFIL] = useState(false)
    
    useEffect(()=>{
        console.log('inside useEffect')
        unsureTransferInitListener(privateKey)      
        // setUTFIL(true)
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
                        <AccordionPanel pb={4}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat.
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            )}

        </>
    )
}

export default Notifications