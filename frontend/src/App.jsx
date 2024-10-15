import React from 'react'
import Wallet from './components/Wallet'
import { ChakraProvider } from '@chakra-ui/react'
import Hello from './Hello'

function App() {

  return (
    <ChakraProvider>
      <Wallet />
    </ChakraProvider>
  )
}

export default App
