import { api, openSchema, SchemaConfig } from '@/services/api'
import { AsyncStorage } from 'react-native'
import Realm from 'realm'
import { LocalStorage } from '@/services/storage'
import UserSchema from 'showsourcing-schema/user'
import { env } from '@/env'
import { selectTeamStore } from '@/stores/selectTeamStore'
import { downloadTeamStore } from '@/stores/downloadTeamStore'
import { AppSubscription } from '@/services/subscription'

type AuthDto = Readonly<{
  login: string
  password: string
}>

type SignUpDto = Readonly<{
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
}>

type OpenSchemaDto = Readonly<{
  user: Realm.Sync.User
  uri: string
  schema: (Realm.ObjectClass | Realm.ObjectSchema)[]
}>

type AuthResponse = Readonly<{
  emailValidated: boolean
  jwtToken: string
}>

export class Auth2 {
  private _token = ''
  private _user = Realm.Sync.User.current

  async saveToken(token: string = '') {
    await AsyncStorage.setItem(LocalStorage.TOKEN, token)
  }

  async getToken() {
    return AsyncStorage.getItem(LocalStorage.TOKEN)
  }

  async loginRealm(token = '') {
    if (this._user) return this._user

    this._user = await Realm.Sync.User.login(
      env.realmAuthUrl(),
      Realm.Sync.Credentials.jwt(token || this._token)
    )

    return this._user
  }

  openSchema(config: SchemaConfig) {
    return openSchema({
      ...config,
      partial: true,
      user: config.user || this._user,
    })
  }

  async auth(data: AuthDto) {
    const _token = await this.getToken()

    if (_token) {
      return _token
    }

    if (!data.login || (!data.password && _token)) {
      return _token
    }

    const response = await api.post<AuthResponse>('/user/auth', data)

    const token = response.data.jwtToken

    this._token = token
    await this.saveToken(token)

    return token
  }

  async openUserSchema(token?: string) {
    const user = await this.loginRealm(token)

    return this.openSchema({
      user,
      schema: UserSchema,
      path: 'user/~',
    })
  }

  async signIn(username?: string, password?: string) {
    const token = await this.auth({ password, login: username })
    return this.openUserSchema(token)
  }

  signUp(signUpDto: SignUpDto) {
    return api.post('/user/signup', signUpDto)
  }

  resetPassword(email: string) {
    return api.post('/user/password-reset-request', {
      email,
    })
  }

  async logout() {
    try {
      this._user = null
      this._token = ''
      Object.values(Realm.Sync.User.all).map(u => u.logout())
      const email = await AsyncStorage.getItem(LocalStorage.EMAIL)

      await AsyncStorage.clear()

      /**
       * set data need to keep back again to store
       */
      selectTeamStore.setDataBackToAsyncStorage()
      // downloadTeamStore.writeToLocal()
      downloadTeamStore.clearTeam()
      downloadTeamStore.writeToLocalForHarbourIncoterm()

      /**
       * set team id to empty
       */
      AppSubscription.injectTeamId('')

      if (email) {
        await AsyncStorage.setItem(LocalStorage.EMAIL, email)
      }
    } catch (e) {
      return e
    }
  }
}

export const auth2 = new Auth2()
