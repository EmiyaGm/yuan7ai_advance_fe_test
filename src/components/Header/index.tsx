import Image from "next/image"

export function Header() {
  return (
    <main className="h-[80px]">
      <div className="flex items-center h-[80px]">
        <div className="pl-[55px] pr-[30px]">
          <Image src='images/logo.svg' alt="logo" width={91.1} height={24.7} />
        </div>
        <div className="text-[25px] text-white font-extrabold">数码印花文件生成工具-免费版</div>
      </div>
    </main>
  )
}
