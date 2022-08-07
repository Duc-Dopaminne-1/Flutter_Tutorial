export const SIGNUP = 'SIGNUP'
export const SIGNIN = 'SIGNIN'

export interface IActionCallback {
  param?: any
  onSuccess?: (data?: any) => void
  onFail?: (error?: any) => void
}
