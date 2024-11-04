import { baseAccountUrl, baseUrl } from './config'

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
  formData.append('image_in', file)
  for (const [key, value] of Object.entries<any>(data)) {
    formData.append(key, value)
  }
  // formData.append('function', 0)
  const resp = await fetch(`${baseUrl}/api/v1/redesgin/file`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': token
    }
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
  const resp = await fetch(`${baseAccountUrl}/api/custom/manager/login`, {
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
  const resp = await fetch(`${baseAccountUrl}/api/custom/manager/create`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
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
