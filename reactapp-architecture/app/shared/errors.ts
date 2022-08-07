export enum ErrorCode {
  MissingProductId = 100,
  MissingSupplierId = 101,

  MissingImageFactory = 500,
  MissingProductFactory = 501,
}

export class Errors {
  static alert(message: string) {
    return alert(message)
  }

  static show(data: any[], fallback: ErrorCode[]) {
    const msgCode = data
      .map((item, index) => {
        if (item) {
          return fallback[index]
        }

        return null
      })
      .filter(value => value)

    return (message = 'Something went wrong. Please try again') => {
      const msgCodeString =
        msgCode.length > 0
          ? `${message}. ERRCODE ${msgCode.join(', ')}`
          : message

      Errors.alert(msgCodeString)
    }
  }
}
