'use client'

import React, { createContext, useContext, useState } from 'react'

const AccountContext = createContext({
  account: '',
  accountInfo: {} as any,
  pointInfo: {} as any,
  setAccountData: (data: any) => {},
  setAccountInfoData: (data: any) => {},
  setPointInfoData: (data: any) => {},
})

export const AccountProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [account, setAccount] = useState<any>('')
  const [accountInfo, setAccountInfo] = useState<any>({})
  const [pointInfo, setPointInfo] = useState<any>({})

  const setAccountData = (data: any) => {
    setAccount(data)
  }

  const setAccountInfoData = (data: any) => {
    setAccountInfo(data)
  }

  const setPointInfoData = (data: any) => {
    setPointInfo(data)
  }

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccountData,
        accountInfo,
        setAccountInfoData,
        pointInfo,
        setPointInfoData,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = () => useContext(AccountContext)
