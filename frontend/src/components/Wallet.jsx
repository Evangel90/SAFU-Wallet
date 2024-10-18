import { Button, Stack, Heading, Box, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {generateAccount, getAccountBalance} from '../utils/utils'

function Wallet() {
    const [account, setAccount] = useState()
    const [accBalance, setAccBalance] = useState()
    const [showAddAccountForm, setShowAddAccountForm] = useState(false)
    const [privateKey, setPrivateKey] = useState('')
    const navigate = useNavigate()


    const newAccount = async() =>{
        const generatedAccount = generateAccount("")
        setAccount(generatedAccount)
        const balance = await getAccountBalance(generatedAccount.address)
        setAccBalance(balance)
        navigate('/account-details', { state: { account: generatedAccount, accBalance: balance } })
        console.log(balance)
    }

    const addAccount = (e) => {
        setShowAddAccountForm(true)
    }

    const handleInputChange = (e) => {
        setPrivateKey(e.target.value) 
    }

    const handleSubmit = async() => {
        console.log(privateKey)
        try{
            const addedAccount = generateAccount(privateKey)
            setAccount(addedAccount)
            const balance = await getAccountBalance(addedAccount.address)
            setAccBalance(balance)
            navigate('/account-details', 
                { state: { account: addedAccount, accBalance: balance, privateKey: privateKey } }
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
                {/* {account && (<h2>{account.address}</h2>)} */}
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