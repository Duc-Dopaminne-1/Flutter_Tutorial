import Config from 'react-native-config'

type ProtocolConfig = {
  url: string
  ssl?: boolean
  realm?: boolean
}

export class Env {
  private createProtocol(ssl = true, realm = false) {
    if (realm) {
      return ssl ? 'realms://' : 'realm://'
    }
    return ssl ? 'https://' : 'http://'
  }

  private createUrl(config: ProtocolConfig) {
    return this.createProtocol(config.ssl, config.realm) + config.url
  }

  get SSL() {
    return Config.SERVER_URL !== 'ros-dev2.showsourcing.com:9080'
  }

  // dev2: true
  // other: true
  baseUrl(ssl = true) {
    return this.createUrl({
      ssl,
      url: Config.BASE_URL,
    })
  }

  // dev2: false
  // other: true
  realmAuthUrl(ssl = this.SSL) {
    return this.createUrl({
      ssl,
      url: Config.SERVER_URL + '/',
    })
  }

  // dev2: false
  // other: true
  realmBaseUrl(ssl = this.SSL) {
    return this.createUrl({
      ssl,
      url: Config.SERVER_URL + '/',
      realm: true,
    })
  }
}

export const env = new Env()
