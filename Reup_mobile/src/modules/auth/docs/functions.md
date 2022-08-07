# Functions

- **_login_**(payload)
  -- email: string
  -- password: string
  -- onSuccess?: (user?: any) => void
  -- onFail?: (error?: IError) => void

- **_signUp_**(payload)
  -- email: string
  -- password: string
  -- onSuccess?: (user?: any) => void
  -- onFail?: (error?: IError) => void

- **_loginFacebook_**(payload)
  -- token: string
  -- onSuccess?: (user?: any) => void
  -- onFail?: (error?: IError) => void

- **_loginGoogle_**(payload)
  -- idToken: string
  -- accessToken: string
  -- onSuccess?: (user?: any) => void
  -- onFail?: (error?: IError) => void

- **_updatePassword_**(payload)
  -- password: string
  -- oldPassword?: string
  -- onSuccess?: (result: boolean) => void
  -- onFail?: (error?: IError) => void

- **_updateProfile_**(payload)
  -- data: any
  -- onSuccess?: (user?: any) => void
  -- onFail?: (error?: IError) => void

- **_resetPassword_**(payload)
  -- email: string
  -- onSuccess?: (result: boolean) => void
  -- onFail?: (error?: IError) => void

- **_tryAuth_**(payload)
  -- onSuccess?: (user?: any) => void
  -- onFail?: (error?: IError) => void
