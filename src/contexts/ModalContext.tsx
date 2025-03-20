"use client"

import React, { createContext, useContext, useState } from 'react'

const ModalContext = createContext({
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  isPointOpen: false,
  openPointModal: () => {},
  closePointModal: () => {},
})

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPointOpen, setIsPointOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const openPointModal = () => setIsPointOpen(true)
  const closePointModal = () => setIsPointOpen(false)

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        isPointOpen,
        openPointModal,
        closePointModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)
