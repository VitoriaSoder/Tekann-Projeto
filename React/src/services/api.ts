import { getCookie } from "@/helpers/cookie-utils"
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api"
export type ApiCallback = (result: any, error?: any) => void
export interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  body?: any
  headers?: Record<string, string>
}
export function makeRequest(config: RequestConfig, callback: ApiCallback): void {
  const xhr = new XMLHttpRequest()
  const url = API_BASE_URL + config.path
  xhr.open(config.method, url, true)
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.setRequestHeader("Accept", "application/json")
  const token = getCookie("token")
  if (token) {
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
  }
  if (config.headers) {
    Object.keys(config.headers).forEach(function (key) {
      xhr.setRequestHeader(key, config.headers![key])
    })
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText)
          callback(data, undefined)
        } catch (_e) {
          callback({ msg: xhr.responseText || "Operação realizada com sucesso" }, undefined)
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText)
          callback(undefined, {
            msg: errorData.msg || errorData.message || "Erro na requisição",
            status: xhr.status,
            data: errorData,
          })
        } catch (_e) {
          callback(undefined, { msg: "Erro na requisição", status: xhr.status })
        }
      }
    }
  }
  xhr.onerror = function () {
    callback(undefined, { msg: "Erro de conexão com o servidor.", status: 0 })
  }
  if (config.body) {
    xhr.send(JSON.stringify(config.body))
  } else {
    xhr.send()
  }
}
export function apiGet(path: string, callback: ApiCallback): void {
  makeRequest({ method: "GET", path }, callback)
}
export function apiPost(path: string, body: any, callback: ApiCallback): void {
  makeRequest({ method: "POST", path, body }, callback)
}
export function apiPut(path: string, body: any, callback: ApiCallback): void {
  makeRequest({ method: "PUT", path, body }, callback)
}
export function apiDelete(path: string, callback: ApiCallback): void {
  makeRequest({ method: "DELETE", path }, callback)
}
export function apiPatch(path: string, body: any, callback: ApiCallback): void {
  makeRequest({ method: "PATCH", path, body }, callback)
}
export function authLogin(body: { email: string; password: string }, callback: ApiCallback): void {
  makeRequest({ method: "POST", path: "/auth/login", body }, callback)
}
export function authRegister(
  body: { name: string; email: string; password: string; role: string },
  callback: ApiCallback
): void {
  makeRequest({ method: "POST", path: "/auth/register", body }, callback)
}
export function updateProfile(body: { name: string }, callback: ApiCallback): void {
  makeRequest({ method: "PUT", path: "/users/profile", body }, callback)
}
export function updatePassword(
  body: { currentPassword: string; newPassword: string },
  callback: ApiCallback
): void {
  makeRequest({ method: "PUT", path: "/users/password", body }, callback)
}
export function deleteAccount(callback: ApiCallback): void {
  makeRequest({ method: "DELETE", path: "/users/me" }, callback)
}
