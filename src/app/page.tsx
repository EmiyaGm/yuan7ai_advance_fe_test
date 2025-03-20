'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Button, message, Modal, Result } from 'antd'
import {
  fetchCreateActionOrder,
  fetchGenerateOssPolicy,
  fetchGetActions,
  fetchGetImage,
  fetchGetModels,
  fetchGetOrderById,
  fetchGetOrders,
  fetchGetPoint,
  fetchGetPoints,
  fetchPrePay,
  fetchRedesignFile,
} from '@/api'
import { baseUrl } from '@/api/config'
import useAccount from '@/components/Header/useAccount'
import { useDropzone } from 'react-dropzone'
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useModal } from '@/contexts/ModalContext'

const category: any = {
  6: 'HD_AMPLIFICATION',
  7: 'FOUR_SQUARE',
  8: 'GENERAL_LAYERING',
  9: 'VECTOR_GENERATION(',
}

export default function Home() {
  const [active, setActive] = useState(0)

  const { account, setAccount, setAccountInfo } = useAccount()

  const [file, setFile] = useState<any>()

  const [resultFile, setResultFile] = useState<any>()

  const [originImage, setOriginImage] = useState<any>(null)

  const [loading, setLoading] = useState(false)

  const [fileLoading, setFileLoading] = useState(false)

  const [isMobile, setIsMobile] = useState<boolean>(false)

  const { openModal, openPointModal } = useModal()

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 12000000,
    multiple: false,
  })

  const dealImage = async () => {
    if (account || localStorage.getItem('yqai-account')) {
      const pointRes = await fetchGetPoint()
      let userPoint = 0
      if (pointRes.data && pointRes.msg == 'success') {
        userPoint =
          (pointRes.data.amount || 0) - (pointRes.data.freezeAmount || 0)
      }
      if (userPoint < actions[active].integral) {
        message.info('积分不足，请充值')
        openPointModal()
        return
      }
      if (file) {
        if (typeof file == 'string') {
        } else {
          const path = `${
            actions[active].generateImageType
          }${new Date().getTime()}`
          setLoading(true)
          fetchGenerateOssPolicy({
            ext: file.type.split('/')[1],
            name: file.name.split('.')[0],
            path,
          })
            .then((res: any) => {
              if (res.data && res.msg == 'success') {
                const formData = new FormData()
                formData.append('name', file.name.split('.')[0])
                formData.append('policy', res.data.policy)
                formData.append('OSSAccessKeyId', res.data.accessId)
                formData.append('success_action_status', '200')
                formData.append('signature', res.data.signature)
                formData.append(
                  'key',
                  `${path}/${file.name.split('.')[0]}.${
                    file.type.split('/')[1]
                  }`,
                )
                formData.append('file', file)
                fetch(res.data.uploadUrl, {
                  method: 'POST',
                  body: formData,
                })
                  .then((result) => {
                    if (result.status == 200) {
                      const originalImage = res.data.url
                      fetchCreateActionOrder({
                        id: actions[active].id,
                        originalImage,
                        orderType: actions[active].generateImageType,
                      })
                        .then((r) => {
                          setLoading(false)
                          if (r.data && r.msg == 'success') {
                            if (r.data.id) {
                              fetchPrePay({
                                orderId: r.data.id,
                                payChannel: 'YUANQI',
                                payProduct: 'POINTS_FREEZE_TRANS',
                                payDesc: `${actions[active].name}服务下单，订单号（${r.data.id}）`,
                              }).then((payRes: any) => {
                                if (payRes.data && payRes.msg == 'success') {
                                  console.log(payRes.data)
                                  // TODO 获取用户最新积分
                                  // TODO 处理返回的支付信息
                                  fetchGetOrderById(r.data.id).then((orderRes) => {
                                    if (orderRes.data && orderRes.msg == 'success') {
                                      console.log(orderRes)
                                    }  else if (orderRes.code == 402) {
                                      message.error('登录失效，请重新登录')
                                      logout()
                                    } else {
                                      message.error(orderRes.msg)
                                    }
                                  })
                                } else if (payRes.code == 402) {
                                  message.error('登录失效，请重新登录')
                                  logout()
                                } else {
                                  message.error(payRes.msg)
                                }
                              })
                            }
                          } else if (r.code == 402) {
                            message.error('登录失效，请重新登录')
                            logout()
                          } else {
                            message.error(r.msg)
                          }
                        })
                        .catch(() => {
                          setLoading(false)
                          message.error(
                            `${actions[active].name}服务暂时不可用，请稍后再试`,
                          )
                        })
                    } else {
                      setLoading(false)
                      message.error('图片上传 oss 出错，请联系客服')
                    }
                  })
                  .catch(() => {
                    setLoading(false)
                    message.error('图片上传 oss 出错，请联系客服')
                  })
              } else if (res.code == 402) {
                setLoading(false)
                message.error('登录失效，请重新登录')
                logout()
              } else {
                setLoading(false)
                message.error(res.msg)
              }
            })
            .catch(() => {
              setLoading(false)
              message.error('oss 上传接口出错，请联系客服')
            })
        }
      } else {
        message.info('请选择需要处理的图片')
      }
    } else {
      openModal()
      message.info('请先登录')
    }
  }

  const changeFile = (e: any) => {
    if (account || localStorage.getItem('yqai-account')) {
      if (e.target.files && e.target.files.length > 0) {
        const MAX_SIZE = 12 * 1024 * 1024
        if (e.target.files[0].size > MAX_SIZE) {
          e.target.value = ''
          message.error('上传图片大小不能超过12MB')
          return
        }
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        setFileLoading(true)
        reader.onloadend = () => {
          setOriginImage(reader.result)
          setFile(e.target.files[0])
          setFileLoading(false)
        }
      }
    } else {
      e.target.value = ''
      message.info('请先登录')
    }
  }

  const changeActive = (index: number) => {
    if (index === 2 || index === 3) {
      message.info('即将上线')
    } else {
      setActive(index)
      if (resultFile) {
        setOriginImage(resultFile)
        setFile(resultFile)
      } else {
        setFile(null)
      }
      setResultFile(null)
      setSvgFile(null)
      setPsdFile(null)
    }
  }

  const nextStep = () => {
    if (active === 2) {
      message.info('即将上线')
    } else if (active < 3) {
      changeActive(active + 1)
    }
  }

  const getNextButton = () => {
    switch (active) {
      case 0:
        return actions.length > 1 ? (
          <div
            className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
            onClick={nextStep}
          >
            进入到四方连续
          </div>
        ) : (
          <></>
        )
      case 1:
        return actions.length > 2 ? (
          <div
            className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
            onClick={nextStep}
          >
            进入到通用分层
          </div>
        ) : (
          <></>
        )
      case 2:
        return actions.length > 3 ? (
          <div
            className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
            onClick={nextStep}
          >
            进入到一键配色
          </div>
        ) : (
          <></>
        )
      default:
        return <div></div>
    }
  }

  const getDeal = () => {
    switch (active) {
      case 2:
        return (
          <div className="pt-[24px]">
            <div className="text-[10px] text-black font-extrabold">图层：</div>
            <div>
              {resultFile ? (
                <div className="w-[109px] h-[117px] flex items-center justify-around flex-col bg-[#F4F5F8]">
                  <div className="w-[100px] h-[96px] relative">
                    <img
                      src={resultFile}
                      className=" object-contain w-[100px] h-[96px]"
                    />
                    {/* <Image
                      src={resultFile}
                      alt="resultFile"
                      objectFit="contain"
                      layout="fill"
                    /> */}
                  </div>

                  <div className="text-[10px] text-black text-center">
                    图层1
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            {resultFile && psdFile ? (
              <div
                className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer my-0 mx-auto"
                onClick={downloadImage}
              >
                {/* <a href={psdFile} download="result">
                  下载PNG
                </a> */}
                <div>下载PNG</div>
              </div>
            ) : (
              <div
                className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer my-0 mx-auto"
                onClick={() => {
                  if (file) {
                    message.info('请生成所需要的PNG文件')
                  } else {
                    message.info('请选择需要生成的文件')
                  }
                }}
              >
                下载PNG
              </div>
            )}
          </div>
        )
      case 3:
        return (
          <div className="pt-[24px]">
            <div className="text-[10px] text-black font-extrabold">颜色：</div>
            <div>
              {resultFile ? (
                <div className="w-[50px] h-[54px] flex items-center justify-around flex-col bg-[#F4F5F8]">
                  <Image
                    src={resultFile}
                    alt="resultFile"
                    width={39}
                    height={39}
                    objectFit="cover"
                    style={{ width: '39px', height: '39px' }}
                  />
                  <div className="text-[10px] text-black text-center">
                    颜色1
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            {resultFile && svgFile ? (
              <div
                className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer my-0 mx-auto"
                onClick={downloadSvg}
              >
                下载svg文件
              </div>
            ) : (
              <div
                className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer my-0 mx-auto"
                onClick={() => {
                  if (file) {
                    message.info('请生成所需要的svg文件')
                  } else {
                    message.info('请选择需要生成的文件')
                  }
                }}
              >
                下载svg文件
              </div>
            )}
          </div>
        )
      default:
        return <div></div>
    }
  }

  const getModels = () => {
    fetchGetModels({ catrgory: 1 }).then((res) => {
      console.log(res)
    })
  }

  const downloadZip = () => {
    window.open(
      'https://image.yuanqiai.xyz/freetool/download/upscayl-2.11.5-win.exe',
    )
  }

  const [uid, setUid] = useState('')

  const resultFileLoad = () => {
    setLoading(false)
  }

  const [psdFile, setPsdFile] = useState<any>(null)

  const [svgFile, setSvgFile] = useState<any>(null)

  const getImage = (id: any) => {
    if (id) {
      fetchGetImage(id)
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const downloadImage = () => {
    setLoading(true)
    getImageBlob(resultFile).then(async (res: any) => {
      // return blobToFile(res, 'resultFile');
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = URL.createObjectURL(res)
      link.setAttribute('download', 'resultFile.png')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setLoading(false)
    })
  }

  const getImageBlob = (url: string) => {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status == 200) {
          resolve(this.response)
        }
      }
      xhr.onerror = reject
      xhr.send()
    })
  }

  const downloadSvg = () => {
    const svgContent = new XMLSerializer().serializeToString(svgFile)

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${uid}.svg`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url) // 释放对象URL资源
  }

  const pasteFunc = (pe: any) => {
    // pe.preventDefault()
    // pe.stopPropagation()
    const data = pe.clipboardData!.files[0]
    if (!data) {
      return
    }
    // originFile.value = data
    if (data && data.type.indexOf('image/') === -1) {
      message.info('你所复制的内容不是图片，无法粘贴')
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(data)
    setFileLoading(true)
    reader.onloadend = () => {
      setOriginImage(reader.result)
      setFile(data)
      setFileLoading(false)
    }
  }

  const [actions, setActions] = useState<any[]>([])

  const getActions = () => {
    fetchGetActions().then((res: any) => {
      if (res.data && res.msg == 'success') {
        setActions(res.data)
        if (res.data.length > 0 && res.data[active].categoryId) {
          getOrders(res.data[active].generateImageType)
        }
      }
    })
  }

  const [page, setPage] = useState(1)

  const [isEnd, setIsEnd] = useState(false)

  const logout = () => {
    setAccount('')
    setAccountInfo({})
    window.localStorage.setItem('yqai-token', '')
    window.localStorage.setItem('yqai-account', '')
    window.localStorage.setItem('yqai-accountInfo', '{}')
  }

  const getOrders = (type: any) => {
    fetchGetOrders({ page, size: 5, type }).then((res: any) => {
      if (res.data && res.msg == 'success') {
        setOrderList(orderList.concat(res.data))
        if (res.data.length < 5) {
          setIsEnd(true)
        } else {
          setPage(page + 1)
        }
      } else if (res.code == 402) {
        message.error('登录失效，请重新登录')
        logout()
      } else {
        message.error(res.msg)
      }
    })
  }

  const [orderList, setOrderList] = useState<any[]>([])

  useEffect(() => {
    // getModels()
    const ua = navigator.userAgent.toLowerCase()
    const agents = [
      'iphone',
      'ipad',
      'ipod',
      'android',
      'linux',
      'windows phone',
    ]
    for (let i = 0; i < agents.length; i++) {
      if (ua.indexOf(agents[i]) !== -1) {
        setIsMobile(true)
      }
    }
    document.addEventListener('paste', pasteFunc)
    getActions()

    return function cleanUp() {
      document.removeEventListener('paste', pasteFunc)
    }
  }, [])

  useEffect(() => {
    if (account) {
      getOrders(actions[active].generateImageType)
    }
  }, [account, active])

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(acceptedFiles[0])
      setFileLoading(true)
      reader.onloadend = () => {
        setOriginImage(reader.result)
        setFile(acceptedFiles[0])
        setFileLoading(false)
      }
    }
  }, [acceptedFiles])

  return (
    <div className="childrenHeight bg-white rounded-[34px] flex items-center justify-between w-screen my-0 mx-auto">
      {actions.length > 0 ? (
        <>
          <div className="w-[112px] bg-white h-full flex items-center flex-col relative rounded-l-[34px] justify-around sideShadow">
            {actions.map((item, index) => (
              <div
                className={
                  active === index
                    ? 'w-[70px] h-[68px] rounded-md border border-black flex items-center justify-center text-[15px] font-extrabold text-white bg-black cursor-pointer'
                    : 'w-[70px] h-[68px] rounded-md border border-black flex items-center justify-center text-[15px] font-extrabold cursor-pointer fill-button'
                }
                onClick={() => changeActive(index)}
                key={item.id}
              >
                {item.name.substring(0, 2)}
                <br />
                {item.name.substring(2)}
              </div>
            ))}
            {/* <div
              className={
                active === 0
                  ? 'w-[70px] h-[68px] rounded-md border border-black flex items-center justify-center text-[15px] font-extrabold text-white bg-black cursor-pointer mt-[134px]'
                  : 'w-[70px] h-[68px] rounded-md border border-black flex items-center justify-center text-[15px] font-extrabold cursor-pointer fill-button mt-[134px]'
              }
              onClick={() => changeActive(0)}
            >
              高清
              <br />
              放大
            </div>
            <div
              className={
                active === 1
                  ? 'w-[70px] h-[68px] rounded-md border border-black flex items-center justify-center text-[15px] font-extrabold text-white bg-black cursor-pointer'
                  : 'w-[70px] h-[68px] rounded-md border border-black flex items-center justify-center text-[15px] font-extrabold cursor-pointer fill-button'
              }
              onClick={() => changeActive(1)}
            >
              四方
              <br />
              连续
            </div>
            <div
              className={
                active === 2
                  ? 'w-[70px] h-[68px] rounded-md border border-black flex items-center justify-center text-[15px] font-extrabold text-white bg-black cursor-pointer'
                  : 'w-[70px] h-[68px] rounded-md border border-black flex items-center justify-center text-[15px] font-extrabold cursor-pointer fill-button'
              }
              onClick={() => changeActive(2)}
            >
              通用
              <br />
              分层
            </div>
            <div
              className={
                active === 3
                  ? 'w-[70px] h-[68px] rounded-md border border-black flex items-center justify-center text-[15px] font-extrabold text-white bg-black cursor-pointer mb-[267px]'
                  : 'w-[70px] h-[68px] rounded-md border border-black flex items-center justify-center text-[15px] font-extrabold cursor-pointer fill-button mb-[267px]'
              }
              onClick={() => changeActive(3)}
            >
              一键
              <br />
              配色
            </div> */}
            {/* <div className=" absolute w-[205px] h-[267px] bg-[#F6F4FE] bottom-0 rounded-[18px] left-3 pt-[15px]">
          <img
            src="/wechat.png"
            className="w-[187px] h-[192px] rounded-[13px] wechatShadow"
          />
          <div className="text-[13px] font-extrabold pt-[22px] pl-2">
            元七AI｜纺织业AI图案专家👆
          </div>
        </div> */}
            {/* {active !== 0 ? (
          <div className=" absolute w-[205px] h-[267px] bg-[#F6F4FE] bottom-0 rounded-[18px] left-3 pt-[15px]">
            <img
              src="/wechat.png"
              className="w-[187px] h-[192px] rounded-[13px] wechatShadow"
            />
            <div className="text-[13px] font-extrabold pt-[22px] pl-2">
              元七AI｜纺织业AI图案专家👆
            </div>
          </div>
        ) : (
          <></>
        )} */}
          </div>
          {active === 4 ? (
            <>
              <div className="flex-1 h-full py-[39px]">
                <div className="flex items-center justify-between h-[50%]">
                  <div className="p-[60px] text-[15px] leading-loose">
                    <div className="font-bold">高清放大功能安装方式：</div>
                    <div>1.下载安装包，支持 windows 系统电脑</div>
                    <div className="mb-[10px]">2.打开安装包，点击安装</div>
                    <div
                      className="w-[217px] h-[29px] bg-black text-white text-[15px] font-extrabold flex items-center justify-center rounded-[28px] my-0 mx-auto cursor-pointer"
                      onClick={downloadZip}
                    >
                      下载安装包
                    </div>
                  </div>
                  <div className="p-[60px] text-[15px] leading-loose border-l">
                    <div className="font-bold">高清放大功能使用方式：</div>
                    <div>打开软件</div>
                    <div>
                      上传需放大的图片，需注意，免费版软件有局限性，对图案处理效果有限
                    </div>
                    <div>
                      选择合适的放大算法模型，手绘类风格推荐 【Digital
                      art】模型，真实照片类风格 ，推荐【Ultrasharp】模型
                    </div>
                    <div>设置结果导出文件夹</div>
                    <div>点击 Upscayl</div>
                  </div>
                </div>
                <div className="flex items-center justify-between h-[50%] mx-[60px] border-t">
                  <div className="text-[23px] leading-loose font-bold">
                    <div>免费版效果不理想？</div>
                    <div>扫码联系，体验元七AI高级版</div>
                  </div>
                  <div className="pr-[60px] text-[23px] leading-loose font-light text-center flex items-center justify-center flex-col">
                    <img
                      src="/wechat.png"
                      className="w-[187px] h-[192px] rounded-[13px] wechatShadow"
                    />
                    <div>微信扫码联系AI专家</div>
                    <div>体验元七AI高级版</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 h-full py-[39px]">
                <div className="h-full border-r border-black/[.2] flex items-center flex-col">
                  {/* {active === 0 ? (
            <div className="flex items-center justify-around mb-[35px]">
              <div className="text-[15px] font-extrabold">放大风格：</div>
              <div className="w-[111px] h-[23px] border border-black rounded-[14px] flex items-center justify-center text-[10px] cursor-pointer">
                渲染风格
              </div>
              <div className="w-[111px] h-[23px] border border-black rounded-[14px] flex items-center justify-center text-[10px] mx-[46px] cursor-pointer">
                实边绘画风格
              </div>
              <div className="w-[111px] h-[23px] border border-black rounded-[14px] flex items-center justify-center text-[10px] cursor-pointer">
                照片风格
              </div>
            </div>
          ) : (
            <div className="h-[58px]"></div>
          )} */}

                  <div className="h-[58px]"></div>

                  <div className="w-[599px] h-[584px] rounded-xl bg-[#F7F7F7] flex items-center justify-center relative">
                    {file ? (
                      <div className="w-[395px] h-[404px] relative">
                        <img
                          src={originImage}
                          alt="originImage"
                          className=" object-contain w-full h-full"
                        />
                        {/* <Image
                      src={originImage}
                      alt="originImage"
                      layout="fill"
                      objectFit="contain"
                    /> */}
                      </div>
                    ) : fileLoading ? (
                      <div className=" absolute h-[593px] bg-black/[.23] top-0 left-0 w-full flex items-center justify-center">
                        <span className="loading loading-infinity loading-lg"></span>
                      </div>
                    ) : (
                      <div
                        {...getRootProps({ className: 'dropzone' })}
                        className="w-full h-full flex items-center justify-center flex-col"
                      >
                        <input {...getInputProps()} accept="image/*" />
                        <p className="text-base">
                          支持拖拽、Ctrl+V 复制上传图片
                        </p>
                        <p className="text-base text-center">
                          图片大小不超过12MB，支持PNG、JPG、JPEG、WEBP等格式
                        </p>
                        <div className="w-[217px] h-[40px] bg-black text-white text-[15px] font-extrabold flex items-center justify-center rounded-[28px] mt-[20px] mx-auto cursor-pointer">
                          <PlusCircleOutlined />
                          上传图片
                        </div>
                      </div>
                      // <input
                      //   type="file"
                      //   className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                      //   accept="image/*"
                      //   onChange={changeFile}
                      // />
                    )}
                  </div>
                  {/* <div className="text-[15px] text-black w-[599px] mt-2">
                上传图片大小不能超过12MB
              </div> */}
                  <div className="relative w-full pt-[56px]">
                    <div className="bg-[#F4F5F8] w-[39px] h-[38px] rounded-md absolute right-[69px] top-[18px] cursor-pointer flex items-center justify-center">
                      <img
                        src="/delete.png"
                        className="w-[28px] h-[30px]"
                        onClick={() => {
                          setFile(null)
                        }}
                      />
                      {/* <Image
                src="/delete.png"
                alt="delete"
                width={28}
                height={30}
                onClick={() => {
                  setFile(null)
                }}
              /> */}
                    </div>
                    {file ? (
                      <div
                        className="w-[217px] h-[54px] text-[16px] bg-black text-white text-base font-extrabold flex items-center justify-center rounded-[28px] my-0 mx-auto cursor-pointer"
                        onClick={dealImage}
                      >
                        <div className="flex items-baseline">
                          立即生成
                          <span className="text-[12px]">
                            消耗{actions[active].integral}积分
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-[217px] h-[54px] bg-gray-400 text-white text-[16px] font-extrabold flex items-center justify-center rounded-[28px] my-0 mx-auto cursor-not-allowed">
                        生成
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full py-[39px]">
                <div className="h-full pl-[62px] pr-[57px] pt-[58px]">
                  <div className="h-[617px] relative">
                    <div className="flex items-center justify-center">
                      {resultFile ? (
                        <div className="w-[593px] h-[617px] relative">
                          <img
                            src={resultFile}
                            className=" object-contain w-[593px] h-[617px]"
                            onLoad={resultFileLoad}
                          />
                          {/* <Image
                    src={resultFile}
                    alt="resultFile"
                    layout="fill"
                    objectFit="contain"
                    onLoad={resultFileLoad}
                  /> */}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    {loading ? (
                      <div className=" absolute h-[617px] bg-black/[.23] top-0 left-0 w-full flex items-center justify-center">
                        <span className="loading loading-infinity loading-lg"></span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  {/* {active == 0 ? (
                <div className="flex items-center justify-between mt-[37px]">
                  123
                </div>
              ) : (
                <div></div>
              )} */}
                  {active === 1 || active === 0 ? (
                    <div className="flex items-center justify-between mt-[37px]">
                      {resultFile ? (
                        <div
                          className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
                          onClick={downloadImage}
                        >
                          下载文件
                        </div>
                      ) : (
                        <div
                          className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            if (file) {
                              message.info('请生成所需要的图片文件')
                            } else {
                              message.info('请选择需要生成的文件')
                            }
                          }}
                        >
                          下载文件
                        </div>
                      )}
                      {getNextButton()}
                    </div>
                  ) : (
                    getDeal()
                  )}
                </div>
              </div>
              <div className=" absolute bottomArea py-2 px-4 flex">
                <div className="w-[200px] h-[200px] border-dashed rounded-sm bg-white border-[3px] cursor-pointer flex items-center justify-center mr-4">
                  <PlusOutlined className="text-[50px]" />
                </div>
                {orderList.length > 0 ? (
                  <></>
                ) : (
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <div>暂无生图订单</div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="w-screen h-full">
            <Result
              status="500"
              title="正在维护中"
              subTitle="对不起，高级版数码印花文件生成工具正在维护中"
              extra={
                <div>
                  <div>联系我们</div>
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
                </div>
              }
            />
          </div>
        </>
      )}

      <Modal
        title="提示"
        open={isMobile}
        footer={(_, { OkBtn, CancelBtn }) => <></>}
        centered={true}
        closable={false}
      >
        <Result
          title="使用电脑端浏览器打开，效果更佳"
          extra={
            <Button
              type="primary"
              key="console"
              onClick={() => {
                setIsMobile(false)
              }}
            >
              我知道了
            </Button>
          }
        />
      </Modal>
    </div>
  )
}
