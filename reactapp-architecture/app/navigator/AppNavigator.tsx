import { CreateSupplierPicker } from '@/modals/CreateSupplier/CreateSupplierPicker'
import { CreateTaskPicker } from '@/modals/CreateTask/CreateTaskPicker'
import { CreateSamplePicker } from '@/modals/CreateSample/CreateSamplePicker'
import { SelectCategoryPicker } from '@/modals/SelectCategory/SelectCategoryPicker'
import { SelectMultiCategory } from '@/modals/SelectCategory/SelectMultiCategory'
import { SelectProductPicker } from '@/modals/SelectProduct/SelectProductPicker'
import { SelectCountryPicker } from '@/modals/SelectCountry/SelectCountryPicker'
import { CreateExtendField } from '@/modals/CreateExtendField/CreateExtendField'
// @ts-ignore
import { SelectCurrencyPicker } from '@/modals/SelectCurrency/SelectCurrencyPicker'
import { SelectCurrencyPickerList } from '@/modals/SelectCurrency/SelectCurrencyPickerList'
// @ts-ignore
import { SelectStatusPickerProduct } from '@/modals/SelectStatusProduct/SelectStatusPickerProduct'
// @ts-ignore
import { SelectStatusPickerSample } from '@/modals/SelectStatusSample/SelectStatusPickerSample'
import { SelectSupplierPicker } from '@/modals/SelectSupplier/SelectSupplierPicker'
import { SelectMultiTag } from '@/modals/SelectTag/SelectMultiTag'
import { SelectUserPicker } from '@/modals/SelectUser/SelectUserPicker'
import { SelectMultiProject } from '@/modals/SelectProject/SelectMultiProject'
// @ts-ignore
import { SelectUnitPicker } from '@/modals/SelectUnit/SelectUnitPicker'
import { SelectEventPicker } from '@/modals/SelectEvent/SelectEventPicker'
import { TextEditorModal } from '@/modals/TextEditor/TextEditorModal'
import { Fade } from '@/navigator/Animations/fade'
import { TabBar } from '@/navigator/Components/TabBar/TabBar'
import { CameraScreen } from '@/screens/Camera/CameraScreen'
import { CreateCompanyScreen } from '@/screens/CreateCompany/CreateCompanyScreen'
import { CreateContactScreen } from '@/screens/CreateContact/CreateContactScreen'
import { CreateProductScreen } from '@/screens/CreateProduct/CreateProductScreen'
import { CreateTeamScreen } from '@/screens/CreateTeam/CreateTeamScreen'
import { ForgottenPasswordScreen } from '@/screens/ForgottenPassword/ForgottenPasswordScreen'
import { GalleryPictureScreen } from '@/screens/GalleryPicture/GalleryPictureScreen'
import { HomeScreen } from '@/screens/Home/HomeScreen'
import { LoadingScreen } from '@/screens/Loading/LoadingScreen'
import { OpenScreen } from '@/screens/Open/OpenScreen'
import { ProductScreen } from '@/screens/Product/ProductScreen'
import { ProductInfoScreen } from '@/screens/ProductInfo/ProductInfoScreen'
import { SelectTeamScreen } from '@/screens/SelectTeam/SelectTeamScreen'
import { SignInScreen } from '@/screens/SignIn/SignInScreen'
import { SignUpScreen } from '@/screens/SignUp/SignUpScreen'
import { SupplierScreen } from '@/screens/Supplier/SupplierScreen'
import { SupplierInfoScreen } from '@/screens/SupplierInfo/SupplierInfoScreen'
import { GlobalSupplierInfoScreen } from '@/screens/GlobalSupplierInfo/GlobalSupplierInfoScreen'
import { colors, metrics } from '@/vars'
import React from 'react'
import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  createAppContainer,
} from 'react-navigation'
import Realm from 'realm'
import { MenuScreen } from '@/screens/Menu/MenuScreen'
import { SettingScreen } from '@/screens/Setting/SettingScreen'
import { TeamMembersScreen } from '@/screens/TeamMembers/TeamMembersScreen'
import { InviteTeamMembersScreen } from '@/screens/InviteTeamMembers/InviteTeamMembersScreen'
import { UserInfoScreen } from '@/screens/UserInfo/UserInfoScreen'
import { ProjectScreen } from '@/screens/Project/ProjectScreen'
import { ProjectInfoScreen } from '@/screens/ProjectInfo/ProjectInfoScreen'
import { TasksScreen } from '@/screens/Tasks/TasksScreen'
import { SampleListScreen } from '@/screens/Sample/SampleListScreen'
import { TasksInfoScreen } from '@/screens/TasksInfo/TasksInfoScreen'
import { SampleInfoScreen } from '@/screens/SampleInfo/SampleInfoScreen'
import { CreateProjectPicker } from '@/modals/CreateProject/CreateProjectPicker'
import { SelectHarbourPicker } from '@/modals/SelectHarbour/SelectHarbourPicker'
import { SelectIncoTermPicker } from '@/modals/SelectIncoTerm/SelectIncoTermPicker'
import { SelectPrice } from '@/modals/SelectPrice/SelectPrice'
// @ts-ignore
import { SelectStatusPickerSupplier } from '@/modals/SelectStatusSupplier/SelectStatusPickerSupplier'
import { EventInfoScreen } from '@/screens/EventInfo/EventInfoScreen'
import { ExhibitorsScreen } from '@/screens/Exhibitors/ExhibitorsScreen'
import { EventScreen } from '@/screens/Event/EventScreen'
import { BusinessCardPictureScreen } from '@/screens/BusinessCardPicture/BusinessCardPictureScreen'
import { selectPlatform } from '@/shared/devices'
import { MultiSearchScreen } from '@/screens/MultiSearch/MultiSearchScreen'
import { DownloadScreen } from '@/screens/Download/DownloadScreen'

Realm.Collection.prototype[Symbol.iterator] = Realm.Collection.prototype.values

const Project = createStackNavigator(
  {
    ProjectScreen,
    ProjectInfoScreen,
  },
  {
    initialRouteName: 'ProjectScreen',
    headerMode: 'none',
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  }
)

const AppTabBar = createBottomTabNavigator(
  {
    HomeScreen,
    ProductScreen,
    SupplierScreen,
    // ProfileScreen,
    Project,
  },
  {
    initialRouteName: 'HomeScreen',
    tabBarOptions: {
      activeTintColor: colors.label_blue_light,
      inactiveTintColor: colors.light_blue_grey,
    },
    tabBarComponent: props => <TabBar {...props} />,
  }
)

const SideMenu = createDrawerNavigator(
  {
    AppTabBar,
  },
  {
    initialRouteName: 'AppTabBar',
    drawerWidth: selectPlatform({
      iPad: 320,
      default: metrics.screen_width / 1.25,
    }),
    // @ts-ignore
    contentComponent: MenuScreen,
    overlayColor: 'rgba(0, 0, 0, 0.7)',
  }
)

const HomeStack = createStackNavigator(
  {
    MultiSearchScreen,
    ProductInfoScreen,
    CreateProductScreen,
    GlobalSupplierInfoScreen,
    SupplierInfoScreen,
    GalleryPictureScreen,
    CameraScreen,
    CreateContactScreen,
    SettingScreen,
    TeamMembersScreen,
    InviteTeamMembersScreen,
    UserInfoScreen,
    TasksScreen,
    SampleListScreen,
    TasksInfoScreen,
    SampleInfoScreen,
    EventInfoScreen,
    ExhibitorsScreen,
    EventScreen,
    BusinessCardPictureScreen,
    // ProjectScreen,
    // ProjectInfoScreen,
    SideMenu,
  },
  {
    initialRouteName: 'SideMenu',
    headerMode: 'none',
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  }
)

const PrivateStack = createStackNavigator(
  {
    HomeStack,
    TextEditorModal,
    SelectMultiTag,
    SelectUserPicker,
    SelectSupplierPicker,
    SelectStatusPickerProduct,
    SelectStatusPickerSample,
    SelectStatusPickerSupplier,
    SelectPrice,
    SelectCategoryPicker,
    SelectMultiCategory,
    SelectProductPicker,
    SelectCurrencyPicker,
    SelectCurrencyPickerList,
    SelectUnitPicker,
    SelectCountryPicker,
    CreateSupplierPicker,
    CreateTaskPicker,
    CreateSamplePicker,
    CreateProjectPicker,
    CreateExtendField,
    SelectMultiProject,
    SelectEventPicker,
    SelectHarbourPicker,
    SelectIncoTermPicker,
  },
  {
    mode: 'modal',
    initialRouteName: 'HomeStack',
    headerMode: 'none',
    transparentCard: true,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
    cardStyle: {
      backgroundColor: 'transparent',
      opacity: 1,
    },
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: 'transparent',
      },
      screenInterpolator: Fade,
    }),
  }
)

const PublicStack = createStackNavigator(
  {
    SignUpScreen,
    OpenScreen,
    ForgottenPasswordScreen,
    SignInScreen: {
      screen: SignInScreen,
      navigationOptions: {
        title: 'Sign In',
        gesturesEnabled: false,
      },
    },
  },
  {
    initialRouteName: 'OpenScreen',
    headerMode: 'none',
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  }
)

const SelectTeamStack = createStackNavigator(
  {
    CreateCompanyScreen,
    CreateTeamScreen,
    SelectTeamScreen,
    DownloadScreen,
  },
  {
    initialRouteName: 'SelectTeamScreen',
    headerMode: 'none',
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  }
)

const LoadingStack = createStackNavigator(
  {
    LoadingScreen,
  },
  {
    initialRouteName: 'LoadingScreen',
    headerMode: 'none',
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  }
)

const MainNavigator = createSwitchNavigator(
  {
    PrivateStack,
    PublicStack,
    SelectTeamStack,
    LoadingStack,
  },
  {
    initialRouteName: 'LoadingStack',
  }
)

export const AppNavigator = createAppContainer(MainNavigator)
