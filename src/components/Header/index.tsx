'use client'

import { Button, Dropdown, Form, Input, Modal, Space } from 'antd'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { LockOutlined, UserOutlined, DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [account, setAccount] = useState<any>('')

  const logout = () => {
    setAccount('')
  }

  const onFinish = (values: any) => {
    // TODO
    console.log('Received values of form: ', values)
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={logout}>退出登录</div>,
    },
  ]

  useEffect(() => {
    if (localStorage.getItem('yqai-account')) {
      setAccount(localStorage.getItem('yqai-account'))
    } else {
      setAccount('')
    }
  }, [])

  return (
    <main className="h-[80px]">
      <div className="flex items-center justify-between max-w-[1592px] my-0 mx-auto">
        <div className="flex items-center h-[80px]">
          <div className="pl-[55px] pr-[30px]">
            <Image
              src="images/logo.svg"
              alt="logo"
              width={91.1}
              height={24.7}
            />
          </div>
          <div className="text-[25px] text-white font-extrabold">
            数码印花文件生成工具-免费版
          </div>
        </div>
        <div>
          {account ? (
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()} className="text-[25px] text-white font-extrabold pr-[30px] cursor-pointer">
                <Space>
                  {account}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          ) : (
            <div
              className="pr-[30px] text-[25px] text-white font-extrabold cursor-pointer"
              onClick={() => {
                setIsModalOpen(true)
              }}
            >
              登录
            </div>
          )}
        </div>
      </div>
      <Modal title="登录" open={isModalOpen} footer={null} destroyOnClose={true} onCancel={() => {setIsModalOpen(false)}}>
        <div className='flex items-center justify-center'>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入你的账号!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入你的密码!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </main>
  )
}
