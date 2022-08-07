import axios from 'axios'
import { BASE_URL } from '@/shared/init'

export enum Method {
  GET,
  POST,
  PUT,
  DELETE
}

export async function callAPI(url: string, method: Method, param?: any) {
  if (method === Method.GET) return methodGet(url)
  if (method === Method.POST) return methodPost(url, param)
  if (method === Method.PUT) return methodPut()
  if (method === Method.DELETE) return methodDelete()
}

async function methodGet(url: string) {
  console.log('URL', `${BASE_URL}${url}`)
  const result = await axios
    .get(`${BASE_URL}${url}`)
    .then(function(response) {
      return response
    })
    .catch(function(error) {
      return error
    })
  return result.data
}

async function methodPost(url: string, param) {
  console.log('URL', `${BASE_URL}${url}`)

  const result = await axios
    .post(`${BASE_URL}${url}`, param)
    .then(function(response) {
      console.log('methodPost', param)
      return response
    })
    .catch(function(error) {
      console.log('methodPost eror', param)
      return error
    })
  return result.data
}

async function methodPut() {}
async function methodDelete() {}
