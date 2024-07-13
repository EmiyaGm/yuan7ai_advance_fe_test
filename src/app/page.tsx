'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { message } from 'antd'
import { fetchGetImage, fetchGetModels, fetchRedesignFile } from '@/api'
import { baseUrl } from '@/api/config'

export default function Home() {
  const [active, setActive] = useState(1)

  const [file, setFile] = useState<any>()

  const [resultFile, setResultFile] = useState<any>()

  const [originImage, setOriginImage] = useState<any>(null)

  const [loading, setLoading] = useState(false)

  const [fileLoading, setFileLoading] = useState(false)

  const dealImage = () => {
    if (file) {
      redesignFile(file, window.localStorage.getItem('yqai-token') || '')
    } else {
      message.info('请选择需要处理的图片')
    }
  }

  const changeFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      setFileLoading(true)
      reader.onloadend = () => {
        setOriginImage(reader.result)
        setFile(e.target.files[0])
        setFileLoading(false)
      }
    }
  }

  const changeActive = (index: number) => {
    if (index) {
      setActive(index)
      setResultFile(null)
      setFile(null)
      setSvgFile(null)
      setPsdFile(null)
    } else {
      message.info('Coming soon...')
    }
  }

  const nextStep = () => {
    if (active < 3) {
      changeActive(active + 1)
    }
  }

  const getNextButton = () => {
    switch (active) {
      case 0:
        return (
          <div
            className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
            onClick={nextStep}
          >
            进入到四方连续
          </div>
        )
      case 1:
        return (
          <div
            className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
            onClick={nextStep}
          >
            进入到通用分层
          </div>
        )
      case 2:
        return (
          <div
            className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer"
            onClick={nextStep}
          >
            进入到矢量生成
          </div>
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
                    <Image
                      src={resultFile}
                      alt="resultFile"
                      objectFit="contain"
                      layout="fill"
                    />
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
              <div className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer my-0 mx-auto">
                <a href={psdFile} download="result">
                  下载psd文件
                </a>
              </div>
            ) : (
              <div
                className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer my-0 mx-auto"
                onClick={() => {
                  if (file) {
                    message.info('请生成所需要的psd文件')
                  } else {
                    message.info('请选择需要生成的文件')
                  }
                }}
              >
                下载psd文件
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
              <div className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer my-0 mx-auto" onClick={downloadSvg}>
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

  const [uid, setUid] = useState('')

  const resultFileLoad = () => {
    setLoading(false)
  }

  const [psdFile, setPsdFile] = useState<any>(null)

  const [svgFile, setSvgFile] = useState<any>(null)

  const redesignFile = (file: any, token: any) => {
    setLoading(true)
    let sendValues = {}
    if (active === 0) {
      sendValues = {
        function: 0,
        option: 4,
        image_width: 1024,
        image_height: 1024,
        dpi: 300,
        model: 'L01',
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
                setResultFile(originImage)
                setPsdFile(`${baseUrl}/api/v1/image/${res.data.uid[0]}`)
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
              message.error("请先登录")
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
      console.log(res)
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

  useEffect(() => {
    // getModels()
  }, [])

  return (
    <div className="childrenHeight bg-white rounded-[34px] flex items-center justify-between w-screen my-0 mx-auto">
      <div className="w-[122px] bg-[#F6F4FE] h-full flex items-center flex-col relative rounded-l-[34px]">
        <div
          className={
            active === 0
              ? 'w-[70px] h-[68px] rounded-md border border-black mt-[134px] mb-[49px] flex items-center justify-center text-[15px] font-extrabold text-white bg-black cursor-pointer'
              : 'w-[70px] h-[68px] rounded-md border border-black mt-[134px] mb-[49px] flex items-center justify-center text-[15px] font-extrabold cursor-pointer fill-button'
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
              ? 'w-[70px] h-[68px] rounded-md border border-black mb-[49px] flex items-center justify-center text-[15px] font-extrabold text-white bg-black cursor-pointer'
              : 'w-[70px] h-[68px] rounded-md border border-black mb-[49px] flex items-center justify-center text-[15px] font-extrabold cursor-pointer fill-button'
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
              ? 'w-[70px] h-[68px] rounded-md border border-black mb-[49px] flex items-center justify-center text-[15px] font-extrabold text-white bg-black cursor-pointer'
              : 'w-[70px] h-[68px] rounded-md border border-black mb-[49px] flex items-center justify-center text-[15px] font-extrabold cursor-pointer fill-button'
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
              ? 'w-[70px] h-[68px] rounded-md border border-black mb-[49px] flex items-center justify-center text-[15px] font-extrabold text-white bg-black cursor-pointer'
              : 'w-[70px] h-[68px] rounded-md border border-black mb-[49px] flex items-center justify-center text-[15px] font-extrabold cursor-pointer fill-button'
          }
          onClick={() => changeActive(3)}
        >
          矢量
          <br />
          生成
        </div>
        <div className=" absolute w-[205px] h-[267px] bg-[#F6F4FE] bottom-0 rounded-[18px] left-3 pt-[15px]">
          <Image
            src="/images/wechat.png"
            alt="wechat"
            width={187}
            height={192}
            className=" rounded-[13px] wechatShadow"
          />
          <div className="text-[13px] font-extrabold pt-[22px] pl-2">
            元七AI｜纺织业AI图案专家👆
          </div>
        </div>
      </div>
      <div className="flex-1 h-full py-[39px]">
        <div className="h-full border-r border-black/[.2] flex items-center flex-col">
          {active === 0 ? (
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
          )}

          <div className="w-[599px] h-[584px] rounded-xl bg-[#F7F7F7] flex items-center justify-center relative">
            {file ? (
              <div className="w-[395px] h-[404px] relative">
                <Image
                  src={originImage}
                  alt="originImage"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : fileLoading ? (
              <div className=" absolute h-[593px] bg-black/[.23] top-0 left-0 w-full flex items-center justify-center">
                <span className="loading loading-infinity loading-lg"></span>
              </div>
            ) : (
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                accept="image/*"
                onChange={changeFile}
              />
            )}
          </div>
          <div className="relative w-full pt-[56px]">
            <div className="bg-[#F4F5F8] w-[39px] h-[38px] rounded-md absolute right-[69px] top-[18px] cursor-pointer flex items-center justify-center">
              <Image
                src="/images/delete.png"
                alt="delete"
                width={28}
                height={30}
                onClick={() => {
                  setFile(null)
                }}
              />
            </div>
            <div
              className="w-[217px] h-[29px] bg-black text-white text-[15px] font-extrabold flex items-center justify-center rounded-[28px] my-0 mx-auto cursor-pointer"
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
                  <Image
                    src={resultFile}
                    alt="resultFile"
                    layout="fill"
                    objectFit="contain"
                    onLoad={resultFileLoad}
                  />
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
          {active === 0 || active === 1 ? (
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
    </div>
  )
}
