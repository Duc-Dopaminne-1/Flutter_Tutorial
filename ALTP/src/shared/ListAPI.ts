import { callAPI, Method } from '@/shared/API'
import axios from 'axios'
import { BASE_URL } from '@/shared/init'

export const getListRank = async () => {
  return await callAPI('getBestScore', Method.GET)
}

export const postLogin = async (param: any) => {
  return await callAPI('login', Method.POST, param)
}

export const postSignUp = async (param: any) => {
  return await callAPI('register', Method.POST, param)
}

export const getQuestionNormal = async () => {
  return await callAPI('getQuestion', Method.GET)
}

export const getUserInfo = async () => {
  return await callAPI('getUser', Method.GET)
}

export const postUpdateScore = async (param: any) => {
  return await callAPI('updateScore', Method.POST, param)
}

export const postForgotPassword = async (param: any) => {
  return await callAPI('forgotPassword', Method.POST, param)
}

export const postUploadAvatar = async (param: any) => {
  await axios.post(`${BASE_URL}uploadAvatar`, param)
}

export const getQUestionFilter = async (param: any) => {
  return await callAPI('getQuestionFilter', Method.POST, param)
}

export const postCreateQuestion = async (param: any) => {
  return await callAPI('createQuestion', Method.POST, param)
}

export const postUpdateQuestion = async (param: any) => {
  return await callAPI('updateQuestion', Method.POST, param)
}

export const postDeleteQuestion = async (param: any) => {
  return await callAPI('deleteQuestion', Method.POST, param)
}

export const postSendFCM = async (param: any) => {
  return await callAPI('sendPush', Method.POST, param)
}

export const postUpdateFCM = async (param: any) => {
  return await callAPI('updateFCM', Method.POST, param)
}
