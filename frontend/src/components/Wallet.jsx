import { Button, Stack, Heading, Box, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {generateAccount } from '../utils/utils'

function Wallet() {
    const [showAddAccountForm, setShowAddAccountForm] = useState(false)
    const [privateKey, setPrivateKey] = useState('')
    const navigate = useNavigate()


    const newAccount = () =>{
        const generatedAccount = generateAccount("")
        setPrivateKey(generatedAccount.privateKey)
        navigate('/account-details', { state: { account: generatedAccount, privateKey: generatedAccount.privateKey } })
        console.log('private key:', generatedAccount.privateKey)
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
            navigate('/account-details', 
                { state: { account: addedAccount, privateKey: privateKey } }
            )
            console.log(addedAccount.address)
        }catch(err){
            console.log('Something wrong! Unable to get account', err)
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
            </Stack>
            {showAddAccountForm && (
                <Box mt={4}>
                    <Heading size='md'>Add Account Details</Heading>
                    <Stack spacing={4} mt={2}>
                        <Input placeholder='Enter Private Key' size='md' type='password' onChange={handleInputChange}/>
                        <Button colorScheme='teal' size='md' onClick={handleSubmit}>Submit</Button>
                    </Stack>
                </Box>
            )}

        </>
    )
}


export default Wallet;