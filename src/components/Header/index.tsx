'use client'

import { Button, Dropdown, Form, Input, message, Modal, Space } from 'antd'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { LockOutlined, UserOutlined, DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { fetchLogin } from '@/api'
import useAccount from './useAccount'

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const { account, setAccount } = useAccount()

  const logout = () => {
    setAccount('')
    window.localStorage.setItem('yqai-token', '')
    window.localStorage.setItem('yqai-account', '')
  }

  const onFinish = (values: any) => {
    fetchLogin(values)
      .then((res) => {
        if (res.access_token) {
          window.localStorage.setItem(
            'yqai-token',
            `Bearer ${res.access_token}`,
          )
          window.localStorage.setItem('yqai-account', values.username)
          setAccount(values.username)
          message.success('登录成功')
          setIsModalOpen(false)
        } else if (res.msg) {
          message.error(res.msg)
        } else {
          message.error('登录失败')
        }
      })
      .catch((error) => {
        message.error('登录失败')
      })
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={logout}>退出登录</div>,
    },
  ]

  useEffect(() => {
    if (window.localStorage.getItem('yqai-account')) {
      setAccount(window.localStorage.getItem('yqai-account'))
    } else {
      setAccount('')
    }
  }, [])

  return (
    <main className="h-[80px]">
      <div className="flex items-center justify-between max-w-[1592px] my-0 mx-auto">
        <div className="flex items-center h-[80px]">
          <div className="pl-[55px] pr-[30px]">
            <img src="/logo.jpg" alt="logo" className="w-[91.1px] h-auto" />
          </div>
          <div className="text-[25px] text-black font-extrabold">
            数码印花文件生成工具-免费版
          </div>
          <div className="flex items-center justify-center ml-[90px]">
            <div className="dropdown dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 bg-transparent shadow-none border-none hover:bg-transparent hover:underline underline-offset-8"
              >
                产品服务
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a
                    href="https://yuan7ai-homepage-fe-test.vercel.app/#service"
                    target="_blank"
                  >
                    AI花型服务
                  </a>
                </li>
                <li>
                  <a
                    href="https://yuan7ai-homepage-fe-test.vercel.app/#service2"
                    target="_blank"
                  >
                    AI面料效果服务
                  </a>
                </li>
                <li>
                  <a
                    href="https://yuan7ai-homepage-fe-test.vercel.app/#tool"
                    target="_blank"
                  >
                    设计师免费AI工具
                  </a>
                </li>
                <li>
                  <a
                    href="https://yuan7ai-homepage-fe-test.vercel.app"
                    target="_blank"
                  >
                    海量公版图库
                  </a>
                </li>
                <li>
                  <a
                    href="https://yuan7ai-homepage-fe-test.vercel.app/#service3"
                    target="_blank"
                  >
                    AI算法定制
                  </a>
                </li>
              </ul>
            </div>
            <div className="dropdown dropdown-hover mx-[56px]">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 bg-transparent shadow-none border-none hover:bg-transparent hover:underline underline-offset-8"
              >
                关于我们
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a
                    href="https://yuan7ai-homepage-fe-test.vercel.app/#team"
                    target="_blank"
                  >
                    关于我们 - 清北团队
                  </a>
                </li>
                <li>
                  <a
                    href="https://yuan7ai-homepage-fe-test.vercel.app/#company2"
                    target="_blank"
                  >
                    投资方
                  </a>
                </li>
                <li>
                  <a
                    href="https://yuan7ai-homepage-fe-test.vercel.app/#company"
                    target="_blank"
                  >
                    合作伙伴
                  </a>
                </li>
              </ul>
            </div>
            <div className="dropdown dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 bg-transparent shadow-none border-none hover:bg-transparent hover:underline underline-offset-8"
              >
                联系我们
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[404px] p-2 shadow"
              >
                <li className="hover:bg-white">
                  <div className="flex items-center justify-center hover:bg-white">
                    <img
                      src="/wechat.png"
                      className="w-[187px] h-[192px] rounded-[13px]"
                    />
                    <img
                      src="/wcx.png"
                      className="w-[187px] h-[192px] rounded-[13px]"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          {account ? (
            <Dropdown menu={{ items }}>
              <a
                onClick={(e) => e.preventDefault()}
                className="text-[25px] text-black font-extrabold pr-[30px] cursor-pointer"
              >
                <Space>
                  {account}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          ) : (
            <div className='flex items-center justify-center'>
              <div
                className="text-[25px] text-black font-extrabold cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true)
                }}
              >
                登录
              </div>
              <div className='text-[25px] text-black font-extrabold'>/</div>
              <div
                className="pr-[30px] text-[25px] text-black font-extrabold cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true)
                }}
              >
                注册
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        title="登录"
        open={isModalOpen}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          setIsModalOpen(false)
        }}
      >
        <div className="flex items-center justify-center">
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
      <Modal
        title="注册"
        open={isRegisterOpen}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          setIsRegisterOpen(false)
        }}
      >
        <div className="flex items-center justify-center">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: '请输入你的姓名!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="姓名"
              />
            </Form.Item>
            <Form.Item
              name="industry"
              rules={[{ required: true, message: '请输入你的行业!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="行业"
              />
            </Form.Item>
            <Form.Item
              name="company"
              rules={[{ required: false, message: '请输入你的公司名称!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="公司名称"
              />
            </Form.Item>
            <Form.Item
              name="job"
              rules={[{ required: false, message: '请输入你的公司名称!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="职位"
              />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: '请输入你的注册手机!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="注册手机"
              />
            </Form.Item>
            <Form.Item
              name="code"
              rules={[{ required: true, message: '请输入你的验证码!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="验证码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </main>
  )
}
