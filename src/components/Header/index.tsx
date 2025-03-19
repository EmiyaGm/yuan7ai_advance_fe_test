'use client'
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Result,
  Row,
  Space,
  Statistic,
  Table,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import {
  LockOutlined,
  UserOutlined,
  DownOutlined,
  MobileOutlined,
  MailOutlined,
  BankOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import type { CountdownProps, MenuProps, RadioChangeEvent } from 'antd'
import {
  fetchCreateOrder,
  fetchGetOrderById,
  fetchGetPoint,
  fetchGetPointRecords,
  fetchGetPoints,
  fetchLogin,
  fetchNewLogin,
  fetchPrePay,
  fetchRegister,
  fetchSendSms,
} from '@/api'
import useAccount from './useAccount'
import {
  LoginForm,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components'
import { QRCodeCanvas } from 'qrcode.react'

const { Countdown } = Statistic

const deadline = Date.now() + 1000 * 60 * 15 // Dayjs is also OK

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const [isPointOpen, setIsPointOpen] = useState(false)

  const [isMyPointOpen, setIsMyPointOpen] = useState(false)

  const [isPayOpen, setIsPayOpen] = useState(false)

  const [isPaySuccessOpen, setIsPaySuccessOpen] = useState(false)

  const [countDown, setCountDown] = useState(0)

  const [loginInitial, setLoginInitial] = useState<any>({})

  const { account, setAccount } = useAccount()

  const [pointInfo, setPointInfo] = useState<any>({})

  const [selectedPoint, setSelectedPoint] = useState<any>({})

  const [payType, setPayType] = useState(1)

  const [pointList, setPointList] = useState<any[]>([])

  const [accountInfo, setAccountInfo] = useState<any>({})

  const logout = () => {
    setAccount('')
    setAccountInfo({})
    window.localStorage.setItem('yqai-token', '')
    window.localStorage.setItem('yqai-account', '')
    window.localStorage.setItem('yqai-accountInfo', '{}')
  }

  const onFinish = async (values: any) => {
    fetchNewLogin(values)
      .then((res) => {
        if (res.data && res.msg == 'success') {
          window.localStorage.setItem('yqai-token', `${res.data.token}`)
          window.localStorage.setItem('yqai-account', res.data.name)
          window.localStorage.setItem(
            'yqai-accountInfo',
            JSON.stringify(res.data),
          )
          setAccount(res.data.name)
          setAccountInfo(res.data)
          message.success('登录成功')
          getUserPoint()
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

  const onRegisterFinish = (values: any) => {
    fetchRegister({
      ...values,
      saleId: 1,
    })
      .then((res) => {
        if (res.data && res.msg == 'success') {
          message.success('注册成功，请使用该手机号进行登录')
          // setAccount(values.phone)
          setLoginInitial({
            phone: values.phone,
          })
          setIsRegisterOpen(false)
          setIsModalOpen(true)
        } else if (res.msg) {
          message.error(res.msg)
        } else {
          message.error('注册失败')
        }
      })
      .catch((error) => {
        message.error('注册失败')
      })
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div
          onClick={() => {
            setIsPointOpen(true)
          }}
        >
          充值积分
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div
          onClick={() => {
            setPage(1)
            setPageSize(10)
            getRecordList(1, 10)
            setIsMyPointOpen(true)
          }}
        >
          积分明细
        </div>
      ),
    },
    {
      key: '3',
      label: <div onClick={logout}>退出登录</div>,
    },
  ]

  const [payOrder, setPayOrder] = useState<any>({})

  const recharge = async (data: any) => {
    if (data.id) {
      fetchCreateOrder({
        commodityItemList: [{ id: data.id, quantity: 1 }],
      }).then((res: any) => {
        if (res.data && res.msg == 'success') {
          if (res.data.id) {
            setSelectedPoint(data)
            setPayOrder(res.data)
            setIsPayOpen(true)
          } else {
            message.error('生成订单失败，请联系客服')
          }
        } else if (res.code == 402) {
          message.error('登录失效，请重新登录')
          logout()
        } else {
          message.error(res.msg)
        }
      })
    }
  }

  const onChange = (e: RadioChangeEvent) => {
    setPayType(e.target.value)
  }

  const getPoints = () => {
    fetchGetPoints().then((res: any) => {
      console.log(res)
      if (res.data && res.msg == 'success') {
        setPointList(
          res.data.map((item: any) => ({
            id: item.id,
            gift: item.description || '',
            price: item.price || 0,
            points: item.integral || 0,
          })),
        )
      }
    })
  }

  const onTimeFinish: CountdownProps['onFinish'] = () => {
    console.log('finished!')
  }

  // const [askOrder, setAskOrder] = useState<any>(null)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [isPayAliOpen, setIsPayAliOpen] = useState(false)

  const clearPayInfo = () => {
    setIsPayWechatOpen(false)
    setIsPayAliOpen(false)
    setWechatPayCode('')
    setIsPayOpen(false)
    getUserPoint()
  }

  const startAskOrder = (id: any) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      fetchGetOrderById(id)
        .then((res: any) => {
          console.log(res)
          if (res.data && res.msg == 'success') {
            if (res.data.payStatus == 'PAID') {
              if (intervalRef.current) clearInterval(intervalRef.current)
              clearPayInfo()
              setIsPaySuccessOpen(true)
              getUserPoint()
            }
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current)
          }
        })
        .catch(() => {
          if (intervalRef.current) clearInterval(intervalRef.current)
        })
    }, 1000)
  }

  const [isPayWechatOpen, setIsPayWechatOpen] = useState(false)

  const [wechatPayCode, setWechatPayCode] = useState('')

  const goToPay = async () => {
    if (payOrder.id) {
      if (payType == 1) {
        fetchPrePay({
          orderId: payOrder.id,
          payChannel: 'ALIPAY',
          payProduct: 'NATIVE',
          payDesc: `积分充值下单，订单号（${payOrder.id}）`,
        }).then((res: any) => {
          if (res.data && res.msg == 'success') {
            if (res.data.payUrl) {
              const payEle = document.getElementById('pay') 
              if (payEle) {
                payEle.innerHTML = res.data.payUrl
                document.forms[0].setAttribute('target', '_blank')
                document.forms[0].submit()
                startAskOrder(payOrder.id)
                setIsPayAliOpen(true)
              } else {
                message.error('生成支付宝订单失败，刷新页面之后重试')
              }
            } else {
              message.error('生成支付宝订单失败，请联系客服')
            }
          } else if (res.code == 402) {
            message.error('登录失效，请重新登录')
            logout()
          } else {
            message.error(res.msg)
          }
        })
      } else {
        fetchPrePay({
          orderId: payOrder.id,
          payChannel: 'WXPAY',
          payProduct: 'NATIVE',
          payDesc: `积分充值下单，订单号（${payOrder.id}）`,
        }).then((res: any) => {
          if (res.data && res.msg == 'success') {
            console.log(res)
            if (res.data.payUrl) {
              setWechatPayCode(res.data.payUrl)
              setIsPayWechatOpen(true)
              startAskOrder(payOrder.id)
            } else {
              message.error('生成微信支付订单错误，请联系客服')
            }
          } else if (res.code == 402) {
            message.error('登录失效，请重新登录')
            logout()
          } else {
            message.error(res.msg)
          }
        })
      }
    }
  }

  const cancelPay = () => {
    setIsPayOpen(false)
  }

  const getUserPoint = async () => {
    fetchGetPoint()
      .then((res: any) => {
        if (res.data && res.msg == 'success') {
          setPointInfo(res.data || {})
        } else if (res.code == 402) {
          message.error('登录失效，请重新登录')
          logout()
        } else {
          message.error(res.msg)
        }
      })
      .catch((error: any) => {
        message.error(error)
      })
  }

  const [recordList, setRecordList] = useState<any[]>([])

  const [selectRecordType, setSelectRecordType] = useState('all')

  const [page, setPage] = useState(1)

  const [pageSize, setPageSize] = useState(10)

  const [total, setTotal] = useState(0)

  const getRecordList = (page: any, pageSize: any) => {
    fetchGetPointRecords({
      page,
      size: pageSize,
      pointListRecordTypeIncome:
        selectRecordType == 'all'
          ? null
          : selectRecordType == 'income'
          ? true
          : false,
    }).then((res: any) => {
      if (res.data && res.msg == 'success') {
        setRecordList(res.data)
      } else if (res.code == 402) {
        message.error('登录失效，请重新登录')
        logout()
      } else {
        message.error(res.msg)
      }
      if (res.pagination) {
        setTotal(res.pagination.total || 0)
      }
    })
  }

  const handleRecordTypeChange = (e: RadioChangeEvent) => {
    setSelectRecordType(e.target.value)
    setPage(1)
    getRecordList(1, pageSize)
  }

  useEffect(() => {
    if (window.localStorage.getItem('yqai-account')) {
      setAccount(window.localStorage.getItem('yqai-account'))
      setAccountInfo(
        JSON.parse(window.localStorage.getItem('yqai-accountInfo') || '{}'),
      )
      getUserPoint()
    } else {
      setAccount('')
      setAccountInfo({})
    }
    getPoints()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
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
            数码印花文件生成工具-高级版
          </div>
          <div className="flex items-center justify-center ml-[10px]">
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
                  <a href="https://home.yuanqiai.xyz/#service" target="_blank">
                    AI花型服务
                  </a>
                </li>
                <li>
                  <a href="https://home.yuanqiai.xyz/#service2" target="_blank">
                    AI面料效果服务
                  </a>
                </li>
                <li>
                  <a href="https://home.yuanqiai.xyz/#tool" target="_blank">
                    设计师免费AI工具
                  </a>
                </li>
                <li>
                  <a href="https://home.yuanqiai.xyz" target="_blank">
                    海量公版图库
                  </a>
                </li>
                <li>
                  <a href="https://home.yuanqiai.xyz/#service3" target="_blank">
                    AI算法定制
                  </a>
                </li>
              </ul>
            </div>
            <div className="dropdown dropdown-hover mx-[48px]">
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
                  <a href="https://home.yuanqiai.xyz/#team" target="_blank">
                    关于我们 - 清北团队
                  </a>
                </li>
                <li>
                  <a href="https://home.yuanqiai.xyz/#company2" target="_blank">
                    投资方
                  </a>
                </li>
                <li>
                  <a href="https://home.yuanqiai.xyz/#company" target="_blank">
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
                  <div className="w-[50px] h-[50px]">
                    <img
                      src={accountInfo.profile}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  {account}
                  <div>
                    剩余积分：
                    {(pointInfo.amount || 0) - (pointInfo.freezeAmount || 0)}
                  </div>
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          ) : (
            <div className="flex items-center justify-center">
              <div
                className="text-[25px] text-black font-extrabold cursor-pointer pr-[30px]"
                onClick={() => {
                  setIsModalOpen(true)
                }}
              >
                登录
              </div>
              {/* <div className="text-[25px] text-black font-extrabold">/</div>
              <div
                className="pr-[30px] text-[25px] text-black font-extrabold cursor-pointer"
                onClick={() => {
                  setIsRegisterOpen(true)
                }}
              >
                注册
              </div> */}
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
          setLoginInitial({})
          setIsModalOpen(false)
        }}
      >
        <div>
          <LoginForm
            logo=""
            title={
              <img src="/logo.jpg" alt="logo" className="w-[91.1px] h-auto" />
            }
            subTitle="面料企业的超级AI花型服务"
            onFinish={onFinish}
            initialValues={loginInitial}
          >
            {/* <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </> */}
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={'prefixIcon'} />,
                }}
                name="phone"
                placeholder={'手机号'}
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'获取验证码'}`
                  }
                  return '获取验证码'
                }}
                phoneName="phone"
                name="smsCode"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
                countDown={countDown}
                onGetCaptcha={async (phone) => {
                  const res = await fetchSendSms({ phone, type: '1' })
                  if (res.data == 60) {
                    message.success(`手机号 ${phone} 验证码发送成功!`)
                    setCountDown(60)
                  } else {
                    message.info(`验证码发送太频繁，请稍后再试`)
                    setCountDown(res.data)
                  }
                }}
              />
            </>
            {/* <div className="mb-6 pb-6">
              <a
                style={{
                  float: 'right',
                }}
                onClick={() => {
                  setIsModalOpen(false)
                  setIsRegisterOpen(true)
                }}
              >
                无账户？前往注册
              </a>
            </div> */}
          </LoginForm>
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
            onFinish={onRegisterFinish}
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
              name="email"
              rules={[{ required: true, message: '请输入你的联系邮箱!' }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="邮箱"
              />
            </Form.Item>
            <Form.Item
              name="company"
              rules={[{ required: true, message: '请输入你的公司名称!' }]}
            >
              <Input
                prefix={<BankOutlined className="site-form-item-icon" />}
                placeholder="公司名称"
              />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: '请输入你的注册手机!' }]}
            >
              <Input
                prefix={<PhoneOutlined className="site-form-item-icon" />}
                placeholder="注册手机"
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
      <Modal
        title="积分充值"
        open={isPointOpen}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          setIsPointOpen(false)
        }}
        width={'60vw'}
      >
        <div>
          <Row gutter={20}>
            {pointList.map((item) => (
              <Col
                span={6}
                key={item.id}
                className="mb-4 cursor-pointer pointCol"
              >
                <div className="border border-gray-200 p-4 rounded-t relative border-b-0">
                  {item.gift && (
                    <div className="bg-red-500 absolute p-1 top-[-14px] left-0 text-sm text-white rounded leading-none">
                      {item.gift}
                    </div>
                  )}
                  <div className="text-center text-[20px] font-bold">
                    {item.points}
                  </div>
                  <div className="my-4">
                    <img src="/point.png" className="w-[50px] h-auto mx-auto" />
                  </div>
                  <div className=" absolute top-0 left-0 pointAction hidden w-full h-full">
                    <div className="flex w-full h-full items-center justify-center bg-black bg-opacity-30">
                      <Button
                        type="primary"
                        onClick={() => {
                          recharge(item)
                        }}
                      >
                        充值
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-center text-[20px] font-bold bg-black text-white py-1 rounded-b">
                  ￥{item.price}
                </div>
              </Col>
            ))}
          </Row>
          <div className="flex items-center justify-between my-2">
            <div className="w-14"></div>
            <div>积分可用于 AI 图像生成，AI 公版图库商品购买等场景</div>
            <div className="dropdown dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 bg-transparent shadow-none border-none hover:bg-transparent hover:underline underline-offset-8"
              >
                联系客服
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[240px] shadow"
              >
                <li className="hover:bg-white">
                  <div className="flex items-center justify-center hover:bg-white">
                    <img
                      src="/wechat.png"
                      className="w-[187px] h-[192px] rounded-[13px]"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="积分明细"
        open={isMyPointOpen}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          setIsMyPointOpen(false)
        }}
        width="70%"
      >
        <div>
          <div className="text-sm">
            当前可用积分：
            {(pointInfo.amount || 0) - (pointInfo.freezeAmount || 0)}
          </div>
          <div className='py-2'>
            <Radio.Group
              value={selectRecordType}
              onChange={handleRecordTypeChange}
              size="small"
            >
              <Radio.Button value="all">全部</Radio.Button>
              <Radio.Button value="income">收入</Radio.Button>
              <Radio.Button value="expand">支出</Radio.Button>
            </Radio.Group>
          </div>
          <Table
            dataSource={recordList}
            scroll={{
              y: '50vh',
            }}
            columns={[
              {
                title: '摘要',
                dataIndex: 'remark',
                key: 'remark',
              },
              {
                title: '日期',
                dataIndex: 'updateTime',
                key: 'updateTime',
              },
              {
                title: '积分变动',
                dataIndex: 'amount',
                key: 'amount',
                render: (value, record) => (
                  <>{record.type == 'INCOME' ? `+${value}` : `-${value}`}</>
                ),
              },
              {
                title: '积分余额',
                dataIndex: 'afterAmount',
                key: 'afterAmount',
                render: (_, record: any) => (
                  <>
                    {(record.afterAmount || 0) -
                      (record.afterFreezeAmount || 0)}
                  </>
                ),
              },
            ]}
            pagination={{
              current: page,
              pageSize: pageSize,
              total,
              onChange: (page, pageSize) => {
                setPage(page)
                setPageSize(pageSize)
                getRecordList(page, pageSize)
              },
            }}
          />
        </div>
      </Modal>
      <Modal
        title="支付订单"
        open={isPayOpen}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          setIsPayOpen(false)
        }}
        maskClosable={false}
      >
        <div>
          <div className="flex items-center justify-around">
            <div>
              <img src="/orderSuccess.png" className="w-[200px] h-auto" />
            </div>
            <div>
              <div>
                <Countdown
                  title="剩余支付时间"
                  value={deadline}
                  onFinish={onTimeFinish}
                />
              </div>
              <div>您的订单已提交成功，请尽快支付</div>
              <div>订单号：{payOrder.id}</div>

              <div>购买详情：积分{selectedPoint.points}</div>
              <div>实付金额：{selectedPoint.price} ¥</div>
            </div>
          </div>
          <div className="mt-[80px] flex items-center justify-center">
            <Radio.Group
              onChange={onChange}
              value={payType}
              options={[
                {
                  value: 1,
                  label: <img src="/aliPay.png" className="w-[180px] h-auto" />,
                },
                {
                  value: 2,
                  label: (
                    <img src="/wechatPay.png" className="w-[180px] h-auto" />
                  ),
                },
              ]}
            />
          </div>
          <div className="flex items-center justify-around mt-[50px] w-full">
            <Button type="primary" onClick={goToPay}>
              前往支付
            </Button>
            <Button type="default" onClick={cancelPay}>
              取消支付
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title="支付成功"
        open={isPaySuccessOpen}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          setIsPaySuccessOpen(false)
        }}
      >
        <div>
          <Result
            status="success"
            title="支付成功"
            subTitle={`订单：${payOrder.id} 支付成功，已成功购买积分${selectedPoint.points}`}
          />
        </div>
      </Modal>
      <Modal
        title="微信扫码支付"
        open={isPayWechatOpen}
        footer={null}
        destroyOnClose={true}
        onCancel={async () => {
          Modal.confirm({
            title: '取消支付',
            content: <>是否确定取消此次支付？</>,
            onOk: () => {
              clearPayInfo()
              if (intervalRef.current) clearInterval(intervalRef.current)
            },
            okText: '确定',
            cancelText: '取消',
          })
        }}
        maskClosable={false}
        afterClose={() => {
          setWechatPayCode('')
        }}
      >
        {wechatPayCode && (
          <div>
            <QRCodeCanvas
              id="qrCode"
              value={wechatPayCode}
              size={200} // 二维码的大小
              fgColor="#000000" // 二维码的颜色
              style={{ margin: 'auto' }}
            />
          </div>
        )}
      </Modal>
      <Modal
        title="支付宝支付中"
        open={isPayAliOpen}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          Modal.confirm({
            title: '取消支付',
            content: <>是否确定取消此次支付？</>,
            onOk: () => {
              clearPayInfo()
              if (intervalRef.current) clearInterval(intervalRef.current)
            },
            okText: '确定',
            cancelText: '取消',
          })
        }}
        maskClosable={false}
      >
        <Result
          title="正在支付中，请稍后"
          extra={
            <Button
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: '取消支付',
                  content: <>是否确定取消此次支付？</>,
                  onOk: () => {
                    clearPayInfo()
                    if (intervalRef.current) clearInterval(intervalRef.current)
                  },
                  okText: '确定',
                  cancelText: '取消',
                })
              }}
            >
              取消支付
            </Button>
          }
        />
      </Modal>
      <div id="pay" className="hidden"></div>
    </main>
  )
}
