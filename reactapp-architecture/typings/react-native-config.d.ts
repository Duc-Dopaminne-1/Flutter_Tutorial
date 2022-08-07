declare module 'react-native-config' {
  interface IAppConfig {
    SERVER_URL: string
    BASE_URL: string

    APP_ID: string
    APP_VERSION_NAME: string
    APP_VERSION_CODE: string
  }

  const AppConfig: IAppConfig = {}

  export default AppConfig
}
