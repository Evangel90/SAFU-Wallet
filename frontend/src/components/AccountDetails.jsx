import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heading, Button, Stack } from '@chakra-ui/react';
import Transfer from './Transfer';
import UnsureTransfer from './UnsureTransfer';
import Notifications from './Notifications';
import { getAccountBalance } from '../utils/utils';

function AccountDetails() {
    const location = useLocation();
    const { account, accBalance, privateKey } = location.state || {};
    const [transferClicked, setTransferClicked] = useState(false);
    const [unsureTransferClicked, setUnsureTransferClicked] = useState(false);
    const [notificationsClicked, setNotificationsClicked] = useState(false);
    const [accountBal, setAccountBal] = useState()
    // const [click, setClick] = useState(false)
    const updateBal = async () => {
        console.log('inside updateBal')
        const balance = await getAccountBalance(account.address)
        console.log(balance)
        setAccountBal(balance)
    }

    useEffect(()=>{
        console.log('useEffect working');
        (async()=> {
            await updateBal()
        })()
    }, [])


    const handleTransfer = async() => {
        setTransferClicked(true)
        setUnsureTransferClicked(false)
        setNotificationsClicked(false)
        // setClick(true)
        
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

    return (
        <>
            <Heading size='lg' fontSize='50px'>
                Account Details
            </Heading>
            {account && (
                <>
                    <Heading size='md' fontSize='20px'>
                        Wallet Address: {account.address}
                    </Heading>
                    <Heading size='md' fontSize='20px'>
                        Wallet Balance: {accountBal} eth
                    </Heading>
                    <Stack spacing={4} mt={2} direction='row'>
                        <Button size='md' onClick={handleTransfer}>Transfer</Button>
                        <Button size='md' onClick={handleUnsureTransfer}>UnsureTransfer</Button>
                        <Button size='md' onClick={handleNotifications}>Notifications</Button>
                    </Stack>
                    <Transfer clicked={transferClicked} privateKey={privateKey} updateBal={updateBal} accountBal={accountBal}/>
                    <UnsureTransfer clicked={unsureTransferClicked} privateKey={privateKey} />
                    <Notifications clicked={notificationsClicked} />

                </>

            )}
        </>
    );
}

export default AccountDetails;