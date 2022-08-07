import { navigation } from '@/navigation/navigation'
import { AppNavigator } from '@/navigator/AppNavigator'
import { AppContext } from '@/screens/App/AppContext'
import { CategoryFactory } from '@/services/category'
import { CommentFactory } from '@/services/comment'
import { CompanyFactory } from '@/services/company'
import { Connection } from '@/services/connection'
import { ContactFactory } from '@/services/contact'
import { CurrencyFactory } from '@/services/currency'
import { GlobalConstantFactory } from '@/services/globalConstant'
import { ImageFactory } from '@/services/image'
import { PriceMatrixFactory } from '@/services/priceMatrix'
import { PriceMatrixRowFactory } from '@/services/priceMatrixRow'
import { ProductFactory } from '@/services/product'
import { ProductStatusFactory } from '@/services/productStatus'
import { SampleStatusFactory } from '@/services/sampleStatus'
import { Progress } from '@/services/progress'
import { LocalStorage } from '@/services/storage'
import { SupplierFactory } from '@/services/supplier'
import { TagFactory } from '@/services/tag'
import { TeamFactory } from '@/services/team'
import { TeamRealmFactory } from '@/services/teamRealm'
import { UserFactory } from '@/services/user'
import { colors, fonts } from '@/vars'
import * as React from 'react'
import { AsyncStorage, StatusBar, View } from 'react-native'
import { setCustomText, setCustomTextInput } from 'react-native-global-props'
import { NavigationScreenProp } from 'react-navigation'
import Realm from 'realm'
import { RealmEnum } from '@/common/constants/RealmEnum'
import { EventFactory } from '@/services/event'
import { GlobalDataFactory } from '@/services/globalData'
import { GlobalEventFactory } from '@/services/globalEvent'
import { GlobalBoothFactory } from '@/services/globalBooth'
import { UltiFactory } from '@/services/ulti'
import { TeamUserFactory } from '@/services/teamUser'
import { ExtendedFieldFactory } from '@/services/extendedField'
import { ExtendedFieldDefinitionFactory } from '@/services/extendedFieldDefinition'
import { ProjectFactory } from '@/services/project'
import { AppSubscription } from '@/services/subscription'
import { InvitationFactory } from '@/services/invitation'
import { TaskFactory } from '@/services/task'
import { SampleFactory } from '@/services/sample'
import { Factory } from '@/services/factory'
import { GlobalHarbourFactory } from '@/services/globalHarbour'
import { GlobalIncoTermFactory } from '@/services/globalIncoTerm'
import { CopyProductFactory } from '@/services/copyProduct'
import { copyProductStore } from '@/stores/copyProductStore'
import { modalStore } from '@/stores/modalStore'
import { DownloadFactory } from '@/services/download'
import { SafeUser } from '@/shared/user'
import { SafeTeamUser } from '@/shared/teamUser'
import { auth2 } from '@/services/auth2'
import I18n from '@/i18n'
import { findIndex } from 'lodash'
import { CustomAlert } from '@/shared/alert'
import { ProductVoteFactory } from '@/services/productVote'
import { SuppplierStatusFactory } from '@/services/supplierStatus'
import { AToastView } from '@/components/AToast/AToastView'
import { TeamCompanyFactory } from '@/services/teamCompany'

// init state
const initialState = {
  realm: null,
  globalRealm: null,
  userRealm: null,
  selectedTeamId: '',

  connection: null,
  progress: null,

  productFactory: null,
  supplierFactory: null,
  categoryFactory: null,
  commentFactory: null,

  teamUserFactory: null,
  invitationFactory: null,
  taskFactory: null,
  sampleFactory: null,
  extendedFieldFactory: null,
  extendedFieldDefinitionFactory: null,
  countryFactory: null,
  currencyFactory: null,
  tagFactory: null,
  projectFactory: null,
  priceMatrix: null,
  priceMatrixRow: null,
  productStatusFactory: null,
  sampleStatusFactory: null,
  supplierStatusFactory: null,
  imageFactory: null,
  userFactory: null,
  contactFactory: null,
  eventFactory: null,
  globalEventFactory: null,
  globalBoothFactory: null,
  globalHarbourFactory: null,
  globalIncoTermFactory: null,
  copyProductFactory: null,
  productVoteFactory: null,
  teamCompanyFactory: null,

  downloadFactory: null,

  teamRealmRealm: null,

  companyFactory: new CompanyFactory(),
  teamFactory: new TeamFactory(),
  globalConstantFactory: new GlobalConstantFactory(),
  globalDataFactory: new GlobalDataFactory(),
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type AppProps = Partial<{
  navigation: NavigationScreenProp<any, any>
  children: JSX.Element | JSX.Element[]
}> &
  DefaultProps

export type AppState = Partial<{
  [key: string]: any

  realm: Realm
  userRealm: Realm
  constantRealm: Realm

  selectedTeamId: string

  connection: Connection
  progress: Progress

  productFactory: ProductFactory
  supplierFactory: SupplierFactory
  categoryFactory: CategoryFactory
  commentFactory: CommentFactory
  imageFactory: ImageFactory

  teamUserFactory: TeamUserFactory
  invitationFactory: InvitationFactory
  taskFactory: TaskFactory
  sampleFactory: SampleFactory
  extendedFieldFactory: ExtendedFieldFactory
  extendedFieldDefinitionFactory: ExtendedFieldDefinitionFactory
  currencyFactory: CurrencyFactory
  tagFactory: TagFactory
  projectFactory: ProjectFactory
  userFactory: UserFactory
  eventFactory: EventFactory

  companyFactory: CompanyFactory
  teamFactory: TeamFactory
  teamRealmFactory: TeamRealmFactory
  globalConstantFactory: GlobalConstantFactory
  priceMatrixFactory: PriceMatrixFactory
  priceMatrixRowFactory: PriceMatrixRowFactory
  productStatusFactory: ProductStatusFactory
  sampleStatusFactory: SampleStatusFactory
  supplierStatusFactory: SuppplierStatusFactory
  contactFactory: ContactFactory
  globalDataFactory: GlobalDataFactory
  globalEventFactory: GlobalEventFactory
  globalBoothFactory: GlobalBoothFactory
  globalHarbourFactory: GlobalHarbourFactory
  globalIncoTermFactory: GlobalIncoTermFactory
  copyProductFactory: CopyProductFactory
  productVoteFactory: ProductVoteFactory
  teamCompanyFactory: TeamCompanyFactory

  downloadFactory: DownloadFactory
}>

export type AppContextState = Partial<{
  login(username: string, password: string): Promise<void>
  addRealm(key: RealmEnum, value: any): void
  selectTeam(selectedTeamId: string, callback?: () => void): void
}> &
  AppState

export class AppContainer extends React.PureComponent<AppProps, AppState> {
  readonly state: AppState = initialState

  constructor(props: AppProps) {
    super(props)
    setCustomText({
      allowFontScaling: false,
      style: {
        fontSize: fonts.size.m,
        fontFamily: fonts.family.SSPRegular,
      },
    })

    setCustomTextInput({
      allowFontScaling: false,
    })
  }

  addRealm = (key: RealmEnum, value: any) => {
    const connection = new Connection(value)
    this.setState({
      connection,
      [key]: value,
    })

    const { teamFactory, companyFactory } = this.state
    switch (key) {
      case RealmEnum.UserRealm:
        teamFactory.realm = value
        companyFactory.realm = value

        UltiFactory.realm = value
        UltiFactory.userRealm = value

        this.setState({
          userRealm: value,
        })

        break
    }
  }

  selectTeam = (selectedTeamId: string, callback?: () => void) => {
    // this.state.realm && this.state.realm.close()
    this.setState(
      {
        selectedTeamId,
      },
      async () => {
        const {
          teamFactory,
          companyFactory,
          globalDataFactory,
          userRealm,
        } = this.state

        if (selectedTeamId) {
          console.log('Team ID', selectedTeamId)
          console.tron(selectedTeamId)
          const realm = teamFactory.open(selectedTeamId)
          // const constantRealm = globalConstantFactory.open()
          const globalData = globalDataFactory.open()

          AppSubscription.injectTeamId(selectedTeamId)
          // workerImage.realm = realm
          // workerImage.init()

          const connection = new Connection(realm)
          const progress = new Progress(realm)
          // const constantProgress = new Progress(constantRealm)

          progress.run()

          const productFactory = new ProductFactory(realm)
          const supplierFactory = new SupplierFactory(realm)
          const categoryFactory = new CategoryFactory(realm)
          const commentFactory = new CommentFactory(realm)
          const tagFactory = new TagFactory(realm)
          const projectFactory = new ProjectFactory(realm)
          const userFactory = new UserFactory(realm)
          const eventFactory = new EventFactory(realm)

          const teamUserFactory = new TeamUserFactory(realm)
          const invitationFactory = new InvitationFactory(realm)
          const taskFactory = new TaskFactory(realm)
          const sampleFactory = new SampleFactory(realm)
          const extendedFieldFactory = new ExtendedFieldFactory(realm)
          const extendedFieldDefinitionFactory = new ExtendedFieldDefinitionFactory(
            realm
          )
          const priceMatrixFactory = new PriceMatrixFactory(realm)
          const priceMatrixRowFactory = new PriceMatrixRowFactory(realm)
          const productStatusFactory = new ProductStatusFactory(realm)
          const sampleStatusFactory = new SampleStatusFactory(realm)
          const supplierStatusFactory = new SuppplierStatusFactory(realm)
          const imageFactory = new ImageFactory(realm)
          const contactFactory = new ContactFactory(realm)
          const copyProductFactory = new CopyProductFactory(realm)
          const productVoteFactory = new ProductVoteFactory(realm)

          const currencyFactory = new CurrencyFactory(globalData)

          const globalEventFactory = new GlobalEventFactory(globalData)
          const globalBoothFactory = new GlobalBoothFactory(globalData)
          const globalHarbourFactory = new GlobalHarbourFactory(globalData)
          const globalIncoTermFactory = new GlobalIncoTermFactory(globalData)

          const downloadFactory = new DownloadFactory(userRealm)

          const teamRealmFactory = new TeamRealmFactory(realm)
          const teamCompanyFactory = new TeamCompanyFactory(realm)

          userFactory.realm = userRealm
          const [subscription] = userFactory.fetchFromUser()

          subscription.subscribe(userInfo => {
            Factory.injectCurrentUser(userInfo)
          })

          // check logout when user is deleted from the team
          let checkLogOut = false
          const [teamSubscription] = teamUserFactory.fetch()
          teamSubscription.subscribe(teamMember => {
            if (teamMember.length <= 0) return

            const indexTeamMember = findIndex(teamMember, member => {
              const { user } = new SafeTeamUser(member as any)
              const { id } = new SafeUser(user)
              const currentUserId = Factory.user().identity

              return id === currentUserId
            })

            if (
              indexTeamMember === -1 &&
              !checkLogOut &&
              connection.isConnected
            ) {
              checkLogOut = true

              CustomAlert.error({
                title: I18n.t('alert'),
                message: I18n.t('removedFromTeam'),
                onPress: () => {
                  auth2.logout().then(() => {
                    navigation.navigate('LoadingScreen', {})
                  })
                },
              })
            }
          })

          this.setState({
            realm,
            connection,
            progress,

            // constantRealm,

            productFactory,
            supplierFactory,
            categoryFactory,
            commentFactory,
            eventFactory,

            teamUserFactory,
            invitationFactory,
            taskFactory,
            sampleFactory,
            extendedFieldFactory,
            extendedFieldDefinitionFactory,
            tagFactory,
            projectFactory,
            currencyFactory,
            priceMatrixFactory,
            priceMatrixRowFactory,
            productStatusFactory,
            sampleStatusFactory,
            supplierStatusFactory,
            imageFactory,
            userFactory,
            contactFactory,
            globalEventFactory,
            globalBoothFactory,
            globalHarbourFactory,
            globalIncoTermFactory,
            copyProductFactory,
            productVoteFactory,
            teamCompanyFactory,

            downloadFactory,

            teamRealmFactory,
          })

          copyProductStore.factory = copyProductFactory
          modalStore.factory = copyProductFactory

          currencyFactory.sync({ descriptor: 'name', deleted: false })
          globalEventFactory.sync({ descriptor: 'id', deleted: false })
          globalHarbourFactory.sync({ descriptor: 'name', deleted: false })
          globalIncoTermFactory.sync({ descriptor: 'name', deleted: false })
          productFactory.sync()
          productVoteFactory.sync({ descriptor: 'value', deleted: false })
          teamUserFactory.sync({ descriptor: 'accessType', deleted: false })
          invitationFactory.sync({ descriptor: 'email', deleted: false })
          taskFactory.sync()
          sampleFactory.sync()
          extendedFieldFactory.sync({ descriptor: 'value', deleted: false })
          extendedFieldDefinitionFactory.sync({
            descriptor: 'order',
            deleted: false,
          })
          supplierFactory.sync()
          contactFactory.sync()
          categoryFactory.sync()
          commentFactory.sync()
          eventFactory.sync()
          tagFactory.sync()
          projectFactory.sync()
          productStatusFactory.sync({ descriptor: 'name', deleted: false })
          sampleStatusFactory.sync({ descriptor: 'name', deleted: false })
          supplierStatusFactory.sync({ descriptor: 'name', deleted: false })
          teamFactory.sync({ deleted: false })
          teamRealmFactory.sync({ descriptor: 'name', deleted: false })
          teamCompanyFactory.sync({ descriptor: 'name', deleted: false })

          await AsyncStorage.setItem(
            LocalStorage.SELECTED_TEAM_ID,
            selectedTeamId
          )
          callback && callback()
        } else {
          teamFactory.sync({ deleted: false })
          companyFactory.sync({ descriptor: 'name', deleted: false })
        }
      }
    )
  }

  initTeamAndCompany = () => {
    const { teamFactory, companyFactory } = this.state

    teamFactory.sync({ deleted: false })
    companyFactory.sync({ descriptor: 'name', deleted: false })
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          addRealm: this.addRealm,
          selectTeam: this.selectTeam,
          initTeamAndCompany: this.initTeamAndCompany,
        }}
      >
        <StatusBar translucent={true} backgroundColor={colors.transparent} />
        <AppNavigator
          ref={navigatorRef => {
            navigation.topLevelNavigator = navigatorRef
          }}
        />
        <AToastView />
      </AppContext.Provider>
    )
  }
}
