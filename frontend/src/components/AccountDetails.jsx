import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heading, Button, Stack , Container, Box} from '@chakra-ui/react';
import Transfer from './Transfer';
import UnsureTransfer from './UnsureTransfer';
import Notifications from './Notifications';
import { getAccountBalance } from '../utils/utils';

function AccountDetails() {
    const location = useLocation();
    const { account, privateKey } = location.state || {};
    const [transferClicked, setTransferClicked] = useState(false);
    const [unsureTransferClicked, setUnsureTransferClicked] = useState(false);
    const [notificationsClicked, setNotificationsClicked] = useState(false);
    const [accountBal, setAccountBal] = useState()
    const [unsureTF, setUnsureTF] = useState(false)

    const updateBal = async () => {
        console.log('inside updateBal')
        const balance = await getAccountBalance(account.address)
        console.log(balance)
        setAccountBal(balance)
        return balance
    }

    useEffect(() => {
        console.log('useEffect working');
        (async () => {
            await updateBal()
        })()
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
    };

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
                            <UnsureTransfer clicked={unsureTransferClicked} privateKey={privateKey} setUnsureTF={setUnsureTF} unsureTF={unsureTF} />
                            <Notifications clicked={notificationsClicked} privateKey={privateKey} unsureTF={unsureTF} />

                        </>

                    )}
                </Box>
            </Container>

        </>
    );
}

export default AccountDetails;