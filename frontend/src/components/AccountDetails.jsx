import { useLocation } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';

function AccountDetails() {
    const location = useLocation();
    const { account, accBalance } = location.state || {};

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
                        Wallet Balance: {accBalance}
                    </Heading>
                </>
                
            )}
        </>
    );
}

export default AccountDetails;