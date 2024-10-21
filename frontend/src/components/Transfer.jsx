import { useEffect, useRef, useState } from 'react'
import { Stack, Input, Button } from '@chakra-ui/react'
import { transferFunds } from '../utils/utils'

function Transfer({ clicked, privateKey, updateBal, accountBal }) {
    const[recipientAddress, setRecipientAddress] = useState('') 
    const[amount, setAmount] = useState('')
    let balanceTimerRef = useRef(null)
    
    useEffect(()=>{
        console.log('useEffect', accountBal)
        return () => {
            if(balanceTimerRef.current){
                clearInterval(balanceTimerRef.current)
            } 
        }
    }, [accountBal])
    
    const handleAddressInput = (e) => {
        setRecipientAddress(e.target.value)
    }
    
    const handleAmountInput = (e) => {
        setAmount(e.target.value)
        console.log(recipientAddress, e.target.value)
    }

    const handleTransfer = async() => {
        await transferFunds(privateKey, recipientAddress, amount)
        const prevBal = accountBal

        balanceTimerRef.current = setInterval(async()=> {
            const newBal = await updateBal()
            console.log('balance', prevBal, newBal)
            if(prevBal !== newBal){
                console.log('account updated. clearing timer')
                clearInterval(balanceTimerRef.current)
            }
        }, 5000)
    }

    return (
        <>
            {clicked && (
                <Stack spacing={4} direction='row' align='center'>
                    <Input placeholder='Enter Recipient Address' onChange={handleAddressInput} />
                    <Input placeholder='Enter Amount in Eth' onChange={handleAmountInput}/>
                    <Button colorScheme='teal' size='lg' onClick={handleTransfer}>Transfer</Button>
                </Stack>
            )}
        </>
    )
}

export default Transfer