'use client'

import Image from 'next/image'
import { act, useState } from 'react'

export default function Home() {
  const [active, setActive] = useState(0)

  const changeActive = (index: number) => {
    setActive(index)
  }

  const getNextButton = () => {
    switch (active) {
      case 0:
        return (
          <div className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer">
            进入到四方连续
          </div>
        )
      case 1:
        return (
          <div className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer">
            进入到通用分层
          </div>
        )
      case 2:
        return (
          <div className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer">
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
          <div className='pt-[24px]'>
            <div className="text-[10px] text-black font-extrabold">图层：</div>
            <div></div>
            <div className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer my-0 mx-auto">
              下载psd文件
            </div>
          </div>
        )
      case 3:
        return (
          <div className='pt-[24px]'>
            <div>颜色：</div>
            <div></div>
            <div className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer my-0 mx-auto">
              下载svg文件
            </div>
          </div>
        )
      default:
        return <div></div>
    }
  }

  return (
    <div className="childrenHeight bg-white rounded-[34px] flex items-center justify-between w-screen">
      <div className="w-[122px] bg-[#F6F4FE] h-full flex items-center flex-col relative rounded-l-[34px]">
        <div
          className={
            active === 0
              ? 'w-[70px] h-[68px] rounded-md border border-black mt-[134px] mb-[49px] flex items-center justify-center text-[15px] font-extrabold text-white bg-black cursor-pointer'
              : 'w-[70px] h-[68px] rounded-md border border-black mt-[134px] mb-[49px] flex items-center justify-center text-[15px] font-extrabold cursor-pointer'
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
              : 'w-[70px] h-[68px] rounded-md border border-black mb-[49px] flex items-center justify-center text-[15px] font-extrabold cursor-pointer'
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
              : 'w-[70px] h-[68px] rounded-md border border-black mb-[49px] flex items-center justify-center text-[15px] font-extrabold cursor-pointer'
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
              : 'w-[70px] h-[68px] rounded-md border border-black mb-[49px] flex items-center justify-center text-[15px] font-extrabold cursor-pointer'
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
          <div></div>
          <div className="w-[599px] h-[584px] rounded-xl bg-[#F7F7F7] flex items-center justify-center">
            <div></div>
          </div>
          <div className="relative w-full pt-[56px]">
            <div className="bg-[#F4F5F8] w-[39px] h-[38px] rounded-md absolute right-[69px] top-[18px] cursor-pointer flex items-center justify-center">
              <Image
                src="/images/delete.png"
                alt="delete"
                width={28}
                height={30}
              />
            </div>
            <div className="w-[217px] h-[29px] bg-black text-white text-[15px] font-extrabold flex items-center justify-center rounded-[28px] my-0 mx-auto cursor-pointer">
              生成
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full py-[39px]">
        <div className="h-full pl-[62px] pr-[57px]">
          <div className="h-[593px] bg-black"></div>
          {active === 0 || active === 1 ? (
            <div className="flex items-center justify-between mt-[37px]">
              <div className="w-[125px] h-[30px] bg-[#F4F5F8] rounded-md text-black text-[15px] flex items-center justify-center cursor-pointer">
                下载文件
              </div>
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
