import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heading, Button, Stack, Container, Box, Tooltip, IconButton } from '@chakra-ui/react';
import { CopyIcon, ArrowBackIcon } from '@chakra-ui/icons';
import Transfer from './Transfer';
import UnsureTransfer from './UnsureTransfer';
import Notifications from './Notifications';
import { ethers, JsonRpcProvider } from "ethers"

function AccountDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { account, privateKey } = location.state || {};
    const [transferClicked, setTransferClicked] = useState(false);
    const [unsureTransferClicked, setUnsureTransferClicked] = useState(false);
    const [notificationsClicked, setNotificationsClicked] = useState(false);
    const [accountBal, setAccountBal] = useState()
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

    const handleBackClick = () => {
        if(transferClicked || unsureTransferClicked || notificationsClicked) {
            setTransferClicked(false);
            setUnsureTransferClicked(false);
            setNotificationsClicked(false);
            return
        }else{
            navigate('/');
        }
    };

    return (
        <>
            <Container maxW='container.md' mt={4} centerContent>
                <Box borderWidth='1px' maxW='30rem' borderRadius='lg' overflow='hidden' p='2rem' align='center'>
                    <Box position="relative" width="100%">
                        <IconButton
                            icon={<ArrowBackIcon />}
                            size="md"
                            onClick={handleBackClick}
                            position="absolute"
                            left="0rem"
                        />
                    </Box>
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
                            <UnsureTransfer clicked={unsureTransferClicked} privateKey={privateKey} />
                            <Notifications clicked={notificationsClicked} setClicked={setNotificationsClicked} privateKey={privateKey} account={account} />

                        </>

                    )}
                </Box>
            </Container>

        </>
    );
}

export default AccountDetails;