import { Stack, Input, Button } from '@chakra-ui/react'

function UnsureTransfer({clicked}){

    return (
        <>
            {clicked && (
                <Stack spacing={4} direction='row' align='center'>
                    <Input placeholder='Enter Recipient Address' />
                    <Input placeholder='Enter Amount' />
                    <Button colorScheme='teal'>Unsure Tf</Button>
                </Stack>
            )}
        </>     
    )
}

export default UnsureTransfer