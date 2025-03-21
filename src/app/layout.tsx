import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import './globals.css'
import { Header } from '@/components/Header'
import { ConfigProvider } from 'antd'
import { ModalProvider } from '@/contexts/ModalContext'
import { AccountProvider } from '@/contexts/AccountContext'
import { LoadingProvider } from '@/contexts/LoadingContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '元七AI-数码印花生成工具',
  description: '元七AI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#222222',
              },
            }}
          >
            <LoadingProvider>
              <AccountProvider>
                <ModalProvider>
                  <Header></Header>
                  {children}
                </ModalProvider>
              </AccountProvider>
            </LoadingProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
