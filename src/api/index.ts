import { baseAccountUrl, baseUrl } from './config'

enum OrderType {
  HD_AMPLIFICATION = 'HD_AMPLIFICATION', // 高清放大
  FOUR_SQUARE = 'FOUR_SQUARE', // 四方连续
  GENERAL_LAYERING = 'GENERAL_LAYERING', // 通用分层
  VECTOR_GENERATION = 'VECTOR_GENERATION', // 矢量生成
}

export const fetchGetModels = async (data: any) => {
  const resp = await fetch(`${baseUrl}/api/v1/models`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  })

  const json = await resp.json()
  return json
}

export const fetchRedesignFile = async (data: any, file: any, token: any) => {
  const formData = new FormData()
  if (typeof file == 'object') {
    formData.append('image_in', file)
  } else {
    formData.append('uid', file)
  }
  for (const [key, value] of Object.entries<any>(data)) {
    formData.append(key, value)
  }
  // formData.append('function', 0)
  const resp = await fetch(`${baseUrl}/api/v1/redesgin/file`, {
    method: 'POST',
    body: formData,
    // headers: {
    //   'Authorization': token
    // }
  })

  const json = await resp.json()
  return json
}

export const fetchImageUpload = async (data: any) => {
  const formData = new FormData()
  formData.append('image_in', data)
  const resp = await fetch(`${baseUrl}/api/v1/image/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'content-type': 'application/json',
    },
  })

  const json = await resp.json()
  return json
}

export const fetchGetImage = async (uid: any) => {
  const resp = await fetch(`${baseUrl}/api/v1/image/${uid}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })

  const json = await resp.json()
  return json
}

export const fetchLogin = async (data: any) => {
  const resp = await fetch(`${baseUrl}/api/v1/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  })

  const json = await resp.json()
  return json
}

export const fetchNewLogin = async (data: any) => {
  const resp = await fetch(`${baseAccountUrl}/api/login/phone-login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  })

  const json = await resp.json()
  return json
}

export const fetchRegister = async (data: any) => {
  const resp = await fetch(`${baseAccountUrl}/api/custom/manager/add`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      CustomerToken: localStorage.getItem('yqai-token') || '',
    },
  })

  const json = await resp.json()
  return json
}

export const fetchSendSms = async (data: any) => {
  const resp = await fetch(`${baseAccountUrl}/api/tools/send_sms`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
  })

  const json = await resp.json()
  return json
}

export const fetchGetPoint = async () => {
  const resp = await fetch(
    `${baseAccountUrl}/api/account/query/get?currency=POINTS`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        CustomerToken: localStorage.getItem('yqai-token') || '',
      },
    },
  )
  const json = await resp.json()
  return json
}

export const fetchGetPoints = async () => {
  const resp = await fetch(`${baseAccountUrl}/api/product/pageQuery`, {
    method: 'POST',
    body: JSON.stringify({ size: 99, page: 1, productCategoryIdList: [5], orderItems: [{ asc: true, column: 'price' }] }),
    headers: {
      'content-type': 'application/json',
    },
  })
  const json = await resp.json()
  return json
}

export const fetchCreateActionOrder = async (data: any) => {
  const resp = await fetch(
    `${baseAccountUrl}/api/order/v2/create-image-order`,
    {
      method: 'POST',
      body: JSON.stringify({
        commodityItemList: [
          {
            id: data.id,
            quantity: 1,
            originalImage: data.originalImage,
            orderType: data.orderType,
          },
        ],
        orderType: data.orderType,
      }),
      headers: {
        'content-type': 'application/json',
        CustomerToken: localStorage.getItem('yqai-token') || '',
      },
    },
  )
  const json = await resp.json()
  return json
}

export const fetchCreateOrder = async (data: any) => {
  const resp = await fetch(
    `${baseAccountUrl}/api/order/v2/create-integral-order`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
        CustomerToken: localStorage.getItem('yqai-token') || '',
      },
    },
  )
  const json = await resp.json()
  return json
}

export const fetchGetActions = async () => {
  const resp = await fetch(`${baseAccountUrl}/api/product/pageQuery`, {
    method: 'POST',
    body: JSON.stringify({
      size: 99,
      page: 1,
      productCategoryIdList: [6],
      orderItems: [{ asc: true, column: 'sort' }],
    }),
    headers: {
      'content-type': 'application/json',
    },
  })
  const json = await resp.json()
  return json
}

export const fetchGetOrders = async (data: any) => {
  const resp = await fetch(`${baseAccountUrl}/api/order/pageQuery`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      CustomerToken: localStorage.getItem('yqai-token') || '',
    },
  })
  const json = await resp.json()
  return json
}

export const fetchPrePay = async (data: any) => {
  const resp = await fetch(`${baseAccountUrl}/api/payment/prepay`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      CustomerToken: localStorage.getItem('yqai-token') || '',
    },
  })
  const json = await resp.json()
  return json
}

export const fetchGetOrderById = async (id: any) => {
  const resp = await fetch(
    `${baseAccountUrl}/api/order/v2/getOrderById?orderId=${id}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        CustomerToken: localStorage.getItem('yqai-token') || '',
      },
    },
  )
  const json = await resp.json()
  return json
}

export const fetchGetPointRecords = async (data: any) => {
  const resp = await fetch(`${baseAccountUrl}/api/account/query/records`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      CustomerToken: localStorage.getItem('yqai-token') || '',
    },
  })
  const json = await resp.json()
  return json
}

export const fetchGenerateOssPolicy = async (data: any) => {
  const resp = await fetch(`${baseAccountUrl}/api/file/generateOssPolicy`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      CustomerToken: localStorage.getItem('yqai-token') || '',
    },
  })
  const json = await resp.json()
  return json
}

export const fetchVote = async (data: any) => {
  const resp = await fetch(`${baseAccountUrl}/api/task/vote`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      CustomerToken: localStorage.getItem('yqai-token') || '',
    },
  })
  const json = await resp.json()
  return json
}

// export const fetchGetPointOrders = async
