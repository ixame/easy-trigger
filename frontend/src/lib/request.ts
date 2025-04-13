import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'
import { toast } from 'sonner'
// import useUserInfoStore from '@/stores/user-info'
// import {toast} from "react-hot-toast";
// ...existing code...
// const baseURL = import.meta.env.VITE_API_URL || `http://127.0.0.1:8080`
export interface ApiResult<T = any> {
  code: number
  msg: string
  requestid: string
  data: T
}

class Request {
  public instance: AxiosInstance
  // 存放取消请求控制器Map
  private readonly abortControllerMap: Map<string, AbortController>

  constructor(config: CreateAxiosDefaults) {
    this.instance = axios.create(config)

    this.abortControllerMap = new Map()

    // 请求拦截器
    this.instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (config.url !== '/login') {
        // const token = useUserInfoStore.getState().userInfo?.token
        // if (token) config.headers['Authorization'] = "Bearer " + token
      }

      const controller = new AbortController()
      const url = config.url || ''
      config.signal = controller.signal
      this.abortControllerMap.set(url, controller)
      return config

    }, Promise.reject)

    // 响应拦截器
    this.instance.interceptors.response.use(
        (response: AxiosResponse) => {
          const url = response.config.url || ''
          this.abortControllerMap.delete(url)
          if (response.data.code !== 0) {
            toast.error(response.data.msg || 'Server Error');
            return Promise.reject(response.data)
          }
          return response.data
        },
        (err) => {
          if (err.response?.status > 400) {
            // toast.error( err.response?.data.message || err.message || 'Server Error');
          }
          if (err.response?.status === 401 || err.response?.status === 403) {
            // useUserInfoStore.setState({userInfo: null})
            window.location.href = `/login?redirect=${window.location.pathname}`
          }
          return Promise.reject(err)
        }
    )
  }

  // 取消全部请求
  cancelAllRequest() {
    for (const [, controller] of this.abortControllerMap) {
      controller.abort()
    }
    this.abortControllerMap.clear()
  }

  // 取消指定的请求
  cancelRequest(url: string | string[]) {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      this.abortControllerMap.get(_url)?.abort()
      this.abortControllerMap.delete(_url)
    }
  }

  request<T = any>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.instance.request(config)
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.instance.get(url, config)
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.instance.post(url, data, config)
  }
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.instance.put(url, data, config)
  }
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    return this.instance.delete(url, config)
  }
  
}


export const HttpClient = new Request({
  timeout: 30 * 1000,
  baseURL: window.location.origin
})