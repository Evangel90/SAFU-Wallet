import { Button, Stack, Heading, Box, Input } from '@chakra-ui/react'
// import { Wallet } from 'ethers'
import { useState } from 'react'
// const generateAccount = require('../utils/utils')
import {generateAccount} from '../utils/utils'

function Wallet() {
    const [account, setAccount] = useState()
    const [showAddAccountForm, setShowAddAccountForm] = useState(false)
    const [privateKey, setPrivateKey] = useState('') 

    const newAccount = () =>{
        const generatedAccount = generateAccount("")
        setAccount(generatedAccount)
    }

    const addAccount = (e) => {
        setShowAddAccountForm(true)
    }

    const handleInputChange = (e) => {
        setPrivateKey(e.target.value) 
    }

    const handleSubmit = () => {
        console.log(privateKey)
        try{
            const addedAccount = generateAccount(privateKey)
            setAccount(addedAccount)
            console.log(addedAccount.address)
        }catch(err){
            console.log('Something wrong! Unable to get account')
        }
    }
    

    return (
        <>
            <Heading size='lg' fontSize='50px'>
                Safe Wallet
            </Heading>
            <Stack spacing={4} direction='row' align='center'>
                <Button colorScheme='teal' size='lg' onClick={newAccount}>
                    Create New Account
                </Button>
                <Button colorScheme='teal' size='lg' onClick={addAccount}>
                    Add Account
                </Button>
                {account && (<h2>{account.address}</h2>)}
            </Stack>
            {showAddAccountForm && (
                <Box mt={4}>
                    <Heading size='md'>Add Account Details</Heading>
                    <Stack spacing={4} mt={2}>
                        <Input placeholder='Enter Private Key' size='md' type='password' onChange={handleInputChange}/>
                        {/* {account && (<h2>{account.address}</h2>)} */}
                        <Button colorScheme='teal' size='md' onClick={handleSubmit}>Submit</Button>
                    </Stack>
                </Box>
            )}

        </>
    )
}


export default Wallet;