'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Button, message, Modal, Result } from 'antd'
import {
  fetchGetActions,
  fetchGetImage,
  fetchGetModels,
  fetchGetPoints,
  fetchRedesignFile,
} from '@/api'
import { baseUrl } from '@/api/config'
import useAccount from '@/components/Header/useAccount'
import { useDropzone } from 'react-dropzone'
import { PlusCircleOutlined } from '@ant-design/icons'

export default function Home() {
  const [active, setActive] = useState(0)

  const { account, setAccount } = useAccount()

  const [file, setFile] = useState<any>()

  const [resultFile, setResultFile] = useState<any>()

  const [originImage, setOriginImage] = useState<any>(null)

  const [loading, setLoading] = useState(false)

  const [fileLoading, setFileLoading] = useState(false)

  const [isMobile, setIsMobile] = useState<boolean>(false)

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

  const dealImage = () => {
    if (account || localStorage.getItem('yqai-account')) {
      if (file) {
        if (typeof file == 'string') {
          const fileArrays = file.split('/')
          redesignFile(
            fileArrays[fileArrays.length - 1],
            window.localStorage.getItem('yqai-token') || '',
          )
        } else {
          redesignFile(file, window.localStorage.getItem('yqai-token') || '')
        }
      } else {
        message.info('请选择需要处理的图片')
      }
    } else {
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
        return  actions.length > 1 ? (
          <div
            className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
            onClick={nextStep}
          >
            进入到四方连续
          </div>
        ) : (<></>)
      case 1:
        return actions.length > 2 ? (
          <div
            className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
            onClick={nextStep}
          >
            进入到通用分层
          </div>
        ) : (<></>)
      case 2:
        return actions.length > 3 ? (
          <div
            className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
            onClick={nextStep}
          >
            进入到一键配色
          </div>
        ) : (<></>)
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

  const redesignFile = (file: any, token: any) => {
    setLoading(true)
    let sendValues = {}
    setResultFile(null)
    setSvgFile(null)
    setPsdFile(null)
    if (active === 0) {
      sendValues = {
        function: 0,
        option: 4,
      }
    } else if (active === 1) {
      sendValues = { function: 1, option: 2 }
    } else if (active === 2) {
      sendValues = { function: 2, option: 4, out_format: 'psd' }
    } else {
      sendValues = { option: 6, out_format: 'svg', function: 2 }
    }
    fetchRedesignFile(sendValues, file, token)
      .then((res) => {
        if (res && res.success) {
          if (res.data && res.data.uid) {
            setLoading(false)
            if (Array.isArray(res.data.uid) && res.data.uid.length > 0) {
              setUid(res.data.uid[0])
              if (active === 2) {
                // setResultFile(originImage)
                setPsdFile(`${baseUrl}/api/v1/image/${res.data.uid[0]}`)
                setResultFile(`${baseUrl}/api/v1/image/${res.data.uid[0]}`)
              } else if (active === 3) {
                fetch(`${baseUrl}/api/v1/image/${res.data.uid[0]}`)
                  .then((body) => body.text())
                  .then((svg) =>
                    new DOMParser().parseFromString(svg, 'image/svg+xml'),
                  )
                  .then((actualSVG) => {
                    setResultFile(originImage)
                    setSvgFile(actualSVG)
                  })
              } else {
                setResultFile(`${baseUrl}/api/v1/image/${res.data.uid[0]}`)
              }
            }
          }
        } else {
          setLoading(false)
          if (res.message) {
            message.error(res.message)
          } else if (res.msg) {
            if (res.msg === 'Missing Authorization Header') {
              message.error('请先登录')
            } else if (res.msg === 'Token has expired') {
              message.error('登录已过期，请重新登录')
              setAccount('')
              window.localStorage.setItem('yqai-token', '')
              window.localStorage.setItem('yqai-account', '')
            } else {
              message.error(res.msg)
            }
          } else {
            message.error('生成失败')
          }
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
        message.error('生成失败')
      })
  }

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
    // TODO 处理复制图片内容
    // previewImgOrg.value = URL.createObjectURL(data)
  }

  const [actions, setActions] = useState<any[]>([])

  const getActions = () => {
    fetchGetActions().then((res: any) => {
      if (res.data && res.msg == 'success') {
        setActions(res.data)
      }
    })
  }

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
                        <p className="text-base">
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
                    <div
                      className="w-[217px] h-[40px] bg-black text-white text-[15px] font-extrabold flex items-center justify-center rounded-[28px] my-0 mx-auto cursor-pointer"
                      onClick={dealImage}
                    >
                      生成
                    </div>
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
              <div className=" absolute bottomArea"></div>
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
