import { useEffect, useRef, useState } from 'react'
import { Stack, Input, Button } from '@chakra-ui/react'
import { transferFunds } from '../utils/utils'

function Transfer({ clicked, privateKey, updateBal, accountBal }) {
    const[recipientAddress, setRecipientAddress] = useState('') 
    const[amount, setAmount] = useState('')
    let timers = useRef(null)
    
    useEffect(()=>{
        console.log('useEffect', accountBal)
        if(timers.current) {
            clearInterval(timers.current)
        }
        return () => {
            if(timers.current) clearInterval(timers.current)
        }
    }, [accountBal])
    
    const handleAddressInput = (e) => {
        setRecipientAddress(e.target.value)
    }
    
    const handleAmountInput = (e) => {
        setAmount(e.target.value)
        console.log(recipientAddress, e.target.value)
    }
    const getBal = () => {
        console.log('...')
        return accountBal
    }
    const handleTransfer = async() => {
        await transferFunds(privateKey, recipientAddress, amount)
        
        // (async()=>{
        //     prevBal !== accountBal ? update : null
        // })()
        
        const prevBal = accountBal
        timers.current = setInterval(()=> {
            let b = getBal()
            console.log('ballance', prevBal, b)
            // if(prevBal > getBal()) {
            //     console.log('account updatd. clearing timer')
            //     clearInterval(timers)
            //     return
            // }
            updateBal()
        }, 3000)
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