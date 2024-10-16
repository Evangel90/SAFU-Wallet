import React from 'react'
import Wallet from './components/Wallet'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AccountDetails from './components/AccountDetails'

function App() {

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Wallet />} />
          <Route path="/account-details" element={<AccountDetails />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App
