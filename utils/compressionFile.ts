const fileToDataURL = (file: Blob): Promise<any> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = (e) => resolve((e.target as FileReader).result)
    reader.readAsDataURL(file)
  })
}
const dataURLToImage = (dataURL: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = dataURL
  })
}

const canvastoFile = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> => {
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), type, quality),
  )
}
/**
 * 图片压缩方法
 * @param {Object}  file 图片文件
 * @param {String} type 想压缩成的文件类型
 * @param {Nubmber} quality 压缩质量参数
 * @returns 压缩后的新图片
 */
export const compressionFile = async (
  file: any,
  callBack: any,
  type = 'image/jpeg',
  quality = 0.5,
) => {
  try {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    img.onload = function () {
      // 设置canvas的尺寸以适应图片尺寸，也可以手动设置以压缩尺寸
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // 压缩图片，quality为压缩质量，0.1到1之间，1为原图质量，0.1为最低质量（最大压缩）
      canvas.toBlob(
        (compressedBlob: any) => {
          // 处理压缩后的Blob对象
          console.log('Compressed blob size:', compressedBlob) // 查看压缩后的Blob大小
          // 可以将compressedBlob用于上传或其它操作
          const newFile = new File(
            [compressedBlob],
            `originImage${new Date().getTime()}`,
            {
              type: type,
            },
          )
          callBack(newFile)
        },
        type,
        quality,
      ) // 第三个参数是质量，0.7为70%质量，可根据需要调整
    }
    img.onerror = (error: any) => {
      console.log(error)
    }
    img.src = file
  } catch (error) {
    console.log(error)
  }
}

export const imageUrlToBase64 = (
  imageUrl: string,
  fileName: string,
): Promise<File> => {
  return new Promise((resolve) => {
    const image = new Image()
    // 让Image元素启用cors来处理跨源请求
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = `${imageUrl}?v=${new Date().getTime()}`
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')!
      context.drawImage(image, 0, 0, image.width, image.height)
      // canvas.toDataURL
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.5) // 第二个参数是压缩质量
      // 将图片的base64转成文件流
      const file = base64ToFile(imageBase64, fileName)
      resolve(file)
    }
  })
}

function base64ToFile(base64: string, fileName: string) {
  const baseArray = base64.split(',')
  // 获取类型与后缀名
  const mime = baseArray[0].match(/:(.*?);/)![1]
  const suffix = mime.split('/')[1]
  // 转换数据
  const bstr = atob(baseArray[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  // 生成文件流
  const file = new File([u8arr], `${fileName}.${suffix}`, {
    type: mime,
  })
  return file
}
