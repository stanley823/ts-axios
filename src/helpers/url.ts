import { isDate, isPlanObject } from './util'

function encode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) return url

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const value = params[key]
    // 如果值為 Null 或 Undefined 則不處理
    if (value === null || typeof value === 'undefined') return

    // 將 value 轉換為陣列的格式、並統一處理
    let values = []

    // 如果 value 已經為陣列的格式，則直接使用
    if (Array.isArray(value)) {
      values = value
      key += '[]'
    } else {
      // 如果 value 不為陣列的格式，則將 value 轉換為陣列的格式
      values = [value]
    }

    values.forEach(value => {
      // 如果 value 為 Date 則轉換為字串的格式
      if (isDate(value)) {
        value = value.toISOString()
      }

      if (isPlanObject(value)) {
        value = JSON.stringify(value)
      }

      parts.push(`${encode(key)}=${encode(value)}`)
    })
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    // 去除 url 中的 # 標記
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    // 如果 url 中已經有 ?，則使用 & 連接，否則使用 ? 連接
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}
