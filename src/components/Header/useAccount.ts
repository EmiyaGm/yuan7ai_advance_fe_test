import { useState } from 'react'

const useAccount = () => {
  const [account, setAccount] = useState<any>('')
  const [accountInfo, setAccountInfo] = useState<any>({})

  return {
    account,
    setAccount,
    accountInfo,
    setAccountInfo
  }
}

export default useAccount
