import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heading, Button, Stack , Container, Box, Tooltip, IconButton} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import Transfer from './Transfer';
import UnsureTransfer from './UnsureTransfer';
import Notifications from './Notifications';
import { ethers, JsonRpcProvider } from "ethers"

function AccountDetails() {
    const location = useLocation();
    const { account, privateKey } = location.state || {};
    const [transferClicked, setTransferClicked] = useState(false);
    const [unsureTransferClicked, setUnsureTransferClicked] = useState(false);
    const [notificationsClicked, setNotificationsClicked] = useState(false);
    const [accountBal, setAccountBal] = useState()
    const [unsureTF, setUnsureTF] = useState() //TODO:set state to timestamp, so as to have a constantly changing state for useEffect in Notifications
    const [copied, setCopied] = useState(false)

    const provider = new JsonRpcProvider("https://eth-holesky.g.alchemy.com/v2/jieawsXv4jXd1QLvQ6R500Nty_qryZVm")

    const updateBal = async () => {
        console.log('inside updateBal')
        const balance = await provider.getBalance(account.address)
        console.log('updateBal', balance)
        setAccountBal(ethers.formatEther(balance))
    }

    useEffect(() => {
        updateBal(account.address)
        console.log('useEffect working');
        provider.on('block', async (blockNumber) => {
            console.log("New block:", blockNumber);
            await updateBal(account.address)
        })
    }, [])


    const handleTransfer = async () => {
        setTransferClicked(true)
        setUnsureTransferClicked(false)
        setNotificationsClicked(false)
        console.log(transferClicked)
    }

    const handleUnsureTransfer = () => {
        setUnsureTransferClicked(true)
        setTransferClicked(false)
        setNotificationsClicked(false)
        console.log(unsureTransferClicked)
    }

    const handleNotifications = () => {
        setNotificationsClicked(true)
        setTransferClicked(false)
        setUnsureTransferClicked(false)
        console.log(notificationsClicked)
    }

    const truncateAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}....${address.slice(-4)}`;
    }

    const copyToClipboard = (address) => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 10000)
    }

    return (
        <>
            <Container maxW='container.md' mt={4} centerContent>
                <Box borderWidth='1px' maxW='30rem' borderRadius='lg' overflow='hidden' p='2rem' align='center'>
                    <Heading size='lg' fontSize='2rem' mb='1rem'>
                        Account Details
                    </Heading>
                    {account && (
                        <>
                            <Heading size='md' fontSize='1.2rem'>
                                {truncateAddress(account.address)}
                                <Tooltip label={copied ? "Copied" : "Copy Address"} aria-label="Copy Address">
                                    <IconButton
                                        icon={<CopyIcon />}
                                        size="sm"
                                        ml={2}
                                        onClick={() => copyToClipboard(account.address)}
                                    />
                                </Tooltip>
                            </Heading>
                            <Heading size='md' fontSize='3rem' fontWeight='normal'>
                                {parseFloat(accountBal) === 0 ? '0.0' : parseFloat(accountBal).toFixed(4)} ETH
                            </Heading>
                            <Stack spacing={4} mt={2} direction='row'>
                                <Button size='md' onClick={handleTransfer}>Transfer</Button>
                                <Button size='md' onClick={handleUnsureTransfer}>UnsureTransfer</Button>
                                <Button size='md' onClick={handleNotifications}>Notifications</Button>
                            </Stack>
                            <Transfer clicked={transferClicked} privateKey={privateKey} updateBal={updateBal} accountBal={accountBal} />
                            <UnsureTransfer clicked={unsureTransferClicked} privateKey={privateKey} setUnsureTF={setUnsureTF} />
                            <Notifications clicked={notificationsClicked} privateKey={privateKey} account={account} unsureTF={unsureTF}/>

                        </>

                    )}
                </Box>
            </Container>

        </>
    );
}

export default AccountDetails;