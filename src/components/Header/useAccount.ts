import { useState } from 'react'

const useAccount = () => {
  const [account, setAccount] = useState<any>('')

  return {
    account,
    setAccount,
  }
}

export default useAccount
