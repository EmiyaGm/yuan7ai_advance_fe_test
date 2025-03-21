'use client'

import React, { createContext, useContext, useState } from 'react'

const LoadingContext = createContext({
  pageLoading: false,
  openLoading: () => {},
  closeLoading: () => {},
})

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [pageLoading, setPageLoading] = useState(false)

  const openLoading = () => setPageLoading(true)
  const closeLoading = () => setPageLoading(false)

  return (
    <LoadingContext.Provider
      value={{
        pageLoading,
        openLoading,
        closeLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
