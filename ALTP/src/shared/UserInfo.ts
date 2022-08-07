class UserInfo {
  userInfo = {}
  isSendAll = false

  setSendAll = (isSendAll: boolean) => {
    this.isSendAll = isSendAll
  }

  getSendAll = () => {
    return this.isSendAll
  }

  setUserInfo = (user: any) => {
    console.log('**** SET USER', user)
    this.userInfo = user
  }

  getUserInfo = () => {
    return this.userInfo
  }
}

export const userInfo = new UserInfo()
