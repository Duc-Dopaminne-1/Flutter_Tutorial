import I18n from '@/i18n'
import { Product, Project, Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { CreateProductButton } from '@/screens/CreateProduct/Components/CreateProductButton'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { colors, devices, images, metrics } from '@/vars'
import { User } from '@/models/common'
import * as React from 'react'
import { StatusBar, StyleSheet, View, Alert, Image } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { CreateProductContext } from './CreateProductContext'
import {
  CreateProductData,
  createProductNavigation,
} from '@/navigation/createProductNavigation'
import { navigation, Screen } from '@/navigation/navigation'
import { AActionBarAvoidKeyboard } from '@/components/AActionBar/AActionBarAvoidKeyboard'
import { SafeProduct } from '@/shared/product'
import { createProductStore } from '@/stores/createProductStore'
import {
  createProduct,
  onProductCreated,
  onItemCreated,
} from '@/services/global'
import { UltiFactory } from '@/services/ulti'
import { eventStore } from '@/stores/eventStore'
import { imageStore3 } from '@/stores/imageStore3'
import { lCache } from '@/libs/LCache'
import {
  checkValidRealmObject,
  filterValidProject,
  filterValidRealmObject,
  isValidListRealmObject,
  isValidRealmObject,
} from '@/shared/validator'
import { CreateProductHeader } from '@/screens/CreateProduct/Components/CreateProductHeader'
import { CreateProductContent } from '@/screens/CreateProduct/Components/CreateProductContent'
import { settingStore } from '@/stores/settingStore'
import { copyProductStore } from '@/stores/copyProductStore'
import { modalStore } from '@/stores/modalStore'
import { cameraStore } from '@/stores/cameraStore'
import { TouchableOpacity } from 'react-native-gesture-handler'

export enum CreateType {
  Multi,
  Single,
}

// init state
const initialState = {
  createType: CreateType.Single,
  allowKeyboardAware: true,
  isBack: false,
  loading: false,
  products: [] as any,
  image: [] as any,
  supplier: null,
  category: null,
  description: '',
  tags: [],
  projects: [],
  price: '',
  currency: 'USD',
  moq: '',
  moqDescription: '',
  name: '',
  status: null,
  harbour: '',
  incoTerm: '',
  event: null,
  editedName: false,
  extendedFields: [],

  innerCarton: {
    width: '',
    height: '',
    length: '',
    itemsQuantity: '',
    weight: '',
    unit: 'cm',
    weightUnit: 'kg',
  },
  masterCarton: {
    width: '',
    height: '',
    length: '',
    itemsQuantity: '',
    weight: '',
    unit: 'cm',
    weightUnit: 'kg',
  },
  modalUnit: {
    openModalInnerUnit: false,
    openModalInnerWeightUnit: false,
    openModalMasterUnit: false,
    openModalMasterWeightUnit: false,
  },
  priceMatrix: {
    rows: [
      {
        price: {
          currency: 'USD',
          value: 0,
        },
        label: '',
      },
    ],
  },

  samplePrice: '',
  currencySamplePrice: 'USD',

  isPressed: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  NavigationInjectedProps<{
    imageData: []
    supplier: Supplier
    project: Project[]
    imageType: string[]
  }> &
  AppContextState

export type State = Readonly<typeof initialState> &
  Readonly<{
    products: Realm.Collection<Product>
    [key: string]: any
    modalUnit: any
    priceMatrix: any
  }>

@withContext(AppContext.Consumer)
export class CreateProductScreen extends React.PureComponent<Props, State> {
  _subscription: Subscription
  _productSubscription: Subscription
  _userResults: Realm.Results<User>
  _productResults: Realm.Results<Product>
  _navListener = new NavigationService(this.props.navigation)
  _onSuccessSubscription: Subscription
  _imageStore3Subscription: Subscription

  readonly state: State = initialState

  constructor(props) {
    super(props)

    navigation.currentScreen = Screen.CreateProduct

    this.state = {
      ...initialState,
      priceMatrix: {
        rows: [
          {
            price: {
              currency: 'USD',
              value: 0,
            },
            label: '',
          },
        ],
      },
    }
  }

  componentDidMount() {
    const { navigation, productFactory } = this.props
    const image = navigation.getParam('imageData', [])
    const supplier = navigation.getParam('supplier', null)
    const project = navigation.getParam('project', [])

    const data = cameraStore.data
    imageStore3.clear()

    if (data.length > 0) {
      imageStore3.append(data)

      lCache.clear()
      cameraStore.clear()
    }

    // init data
    this.initDataToState()

    const [subscription, results] = productFactory.count()
    this._productResults = results

    // When fast creating product the productFactory.count() subscription doesn't work.
    // So generating name from results.length will solve the issue.
    this.setName(results.length)

    this._productSubscription = subscription.subscribe(productsSize => {
      this.setName(productsSize)
    })

    this.setState({
      image,
    })

    if (supplier) {
      this.setState({
        supplier,
      })
    }

    if (project && project.length > 0) {
      this.setState({
        projects: filterValidProject(project).filterProjects,
      })
    }

    this._navListener.didFocus(() => {
      StatusBar.setBarStyle('dark-content', true)
      devices.isAndroid && AndroidKeyboardAdjust.setAdjustResize()
    })
    this._imageStore3Subscription = imageStore3
      .observerResult()
      .subscribe(data => {
        this.setState({
          image: data,
        })
      })
  }

  initDataToNavigation = () => {
    createProductNavigation.setData(CreateProductData.SetValue, this.setValue)
    createProductNavigation.setData(
      CreateProductData.Description,
      this.state.description
    )
    createProductNavigation.setData(CreateProductData.Tags, this.state.tags)
    createProductNavigation.setData(
      CreateProductData.Projects,
      this.state.projects
    )
    createProductNavigation.setData(
      CreateProductData.Currency,
      this.state.currency
    )
    createProductNavigation.setData(CreateProductData.Status, this.state.status)
    createProductNavigation.setData(
      CreateProductData.InnerUnit,
      this.state.innerCarton.unit
    )
    createProductNavigation.setData(
      CreateProductData.InnerWeightUnit,
      this.state.innerCarton.weightUnit
    )
    createProductNavigation.setData(
      CreateProductData.MasterUnit,
      this.state.masterCarton.unit
    )
    createProductNavigation.setData(
      CreateProductData.MasterWeightUnit,
      this.state.masterCarton.weightUnit
    )
    createProductNavigation.setData(
      CreateProductData.currencySamplePrice,
      this.state.currencySamplePrice
    )
    createProductNavigation.setData(
      CreateProductData.priceMatrix,
      this.state.priceMatrix
    )
  }

  initDataToState = () => {
    if (settingStore.copyProduct) {
      this.setState(
        {
          supplier: copyProductStore.supplier,
          category: copyProductStore.category,
          tags: copyProductStore.tags,
          currency: copyProductStore.currency
            ? copyProductStore.currency
            : 'USD',
          status: copyProductStore.status,
          moq: copyProductStore.moq,
          moqDescription: copyProductStore.moqDescription,
          harbour: copyProductStore.harbour,
          incoTerm: copyProductStore.incoTerm,
          event: eventStore.currentEvent
            ? eventStore.currentEvent
            : copyProductStore.event,
          projects: filterValidProject(copyProductStore.projects)
            .filterProjects,
        },
        () => {
          this.initDataToNavigation()
        }
      )

      // set event to selected in modal suggest event to filter
      modalStore.selectSupplier = copyProductStore.supplier
      modalStore.selectCategory = copyProductStore.category
      modalStore.selectEvent = eventStore.currentEvent
        ? eventStore.currentEvent
        : copyProductStore.event

      return
    }

    this.setState(
      {
        supplier: createProductStore.supplier,
        category: createProductStore.category,
        tags: createProductStore.tags,
        currency: createProductStore.currency
          ? createProductStore.currency
          : 'USD',
        status: createProductStore.status,
        moq: createProductStore.moq,
        moqDescription: createProductStore.moqDescription,
        harbour: createProductStore.harbour,
        incoTerm: createProductStore.incoTerm,
        event: eventStore.currentEvent
          ? eventStore.currentEvent
          : createProductStore.event,
        projects: filterValidProject(createProductStore.projects)
          .filterProjects,
      },
      () => {
        this.initDataToNavigation()
      }
    )

    // set event to selected in modal suggest event to filter
    modalStore.selectSupplier = copyProductStore.supplier
    modalStore.selectCategory = copyProductStore.category
    modalStore.selectEvent = eventStore.currentEvent
      ? eventStore.currentEvent
      : createProductStore.event
  }

  componentWillUnmount() {
    this._productSubscription && this._productSubscription.unsubscribe()

    this._userResults && this._userResults.removeAllListeners()
    this._productResults && this._productResults.removeAllListeners()

    this._navListener.removeListener()
    this._subscription && this._subscription.unsubscribe()
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    createProductNavigation.clear()

    lCache.clear()
    cameraStore.clear()

    navigation.removeLastScreen()
    this._onSuccessSubscription && this._onSuccessSubscription.unsubscribe()
    this._imageStore3Subscription && this._imageStore3Subscription.unsubscribe()
  }

  setName = (productsSize: number) => {
    const defaultName = SafeProduct.genericName(
      productsSize,
      UltiFactory.userData()
    )
    this.setState({ name: defaultName })
  }

  onCreate = (type: 'normal' | 'multiple' = 'normal', nextScreen?: string) => {
    // createProduct.next(true)
    if (type === 'normal') {
      this.onCreateNormal(nextScreen)
    }
    if (type === 'multiple') {
      this.onCreateMultiple()
    }
  }

  isAllDataFromPickerValid = () => {
    const { supplier, category, tags, projects, event } = this.state

    let isValid = true

    /**
     * Check supplier data valid or not
     */
    if (!isValidRealmObject(supplier)) {
      this.setState({
        supplier: checkValidRealmObject(supplier, null),
      })
      isValid = false
    }

    /**
     * Check category data valid or not
     */
    if (!isValidRealmObject(category)) {
      this.setState({
        category: checkValidRealmObject(category, null),
      })
      isValid = false
    }

    /**
     * Check tags data valid or not
     */
    if (!isValidListRealmObject(tags)) {
      this.setState({
        tags: filterValidRealmObject(tags),
      })
      isValid = false
    }

    /**
     * Check projects data valid or not
     */
    if (!isValidListRealmObject(projects)) {
      this.setState({
        projects: filterValidRealmObject(projects),
      })
      isValid = false
    }

    /**
     * Check event data valid or not
     */
    if (!isValidRealmObject(event)) {
      this.setState({
        event: checkValidRealmObject(event, null),
      })
      isValid = false
    }

    if (!isValid) {
      alert(I18n.t('someOfFieldHaveBeenRemovedCreateProduct'))
    }

    return isValid
  }

  onCreateNormal = (nextScreen: string) => {
    this.setState({
      loading: true,
      isPressed: true,
    })

    const { productFactory, navigation } = this.props
    const {
      supplier,
      category,
      description,
      tags,
      projects,
      price,
      currency,
      moq,
      moqDescription,
      name,
      status,
      harbour,
      incoTerm,
      event,
      extendedFields,
      innerCarton,
      masterCarton,
      priceMatrix,
      samplePrice,
      currencySamplePrice,
    } = this.state

    if (name !== null && name !== undefined && name.trim().length <= 0) {
      alert(I18n.t('youMustEnterProductName'))
      this.setState({
        loading: false,
        isPressed: false,
      })
      return
    }

    if (!this.isAllDataFromPickerValid()) {
      this.setState({
        loading: false,
        isPressed: false,
      })
      return
    }

    const imageType = navigation.getParam('imageType', [])

    productFactory
      .create({
        supplier,
        category,
        description,
        tags,
        projects,
        currency,
        moqDescription,
        name,
        status,
        harbour,
        incoTerm,
        event,
        extendedFields,
        innerCarton,
        masterCarton,
        priceMatrix,
        currencySamplePrice,
        imageType,
        images: imageStore3.data(),
        samplePrice: Number(samplePrice),
        price: Number(price),
        moq: Number(moq),
      })
      .subscribe(
        product => {
          this.setState({
            loading: false,
            // isPressed: false
          })

          onItemCreated.next({
            product,
            type: 'product',
            id: product ? product.id : null,
          })

          this.goToNextScreen(nextScreen)
        },
        error => {
          this.setState({
            loading: false,
            isPressed: false,
          })

          if (error === 'Object has been deleted or invalidated') {
            alert(I18n.t('createProductFailSomeFieldHaveBeenDeleted'))
          } else {
            alert(I18n.t('createProductFail'))
          }
        }
      )
  }

  onCreateMultiple = () => {
    this.setState({
      loading: true,
      isPressed: true,
    })

    const { productFactory, navigation } = this.props
    const {
      supplier,
      category,
      description,
      tags,
      projects,
      price,
      currency,
      moq,
      moqDescription,
      name,
      status,
      harbour,
      incoTerm,
      event,
      extendedFields,
      innerCarton,
      masterCarton,
      priceMatrix,
      samplePrice,
      currencySamplePrice,
    } = this.state

    if (name !== null && name !== undefined && name.trim().length <= 0) {
      alert(I18n.t('youMustEnterProductName'))
      this.setState({
        loading: false,
        isPressed: false,
      })
      return
    }

    if (!this.isAllDataFromPickerValid()) {
      this.setState({
        loading: false,
        isPressed: false,
      })
      return
    }

    const imageType = navigation.getParam('imageType', [])

    setTimeout(() => {
      this._subscription = productFactory
        .createMultiple(
          imageStore3.data(),
          {
            supplier,
            category,
            description,
            tags,
            projects,
            currency,
            moqDescription,
            name,
            status,
            harbour,
            incoTerm,
            event,
            extendedFields,
            innerCarton,
            masterCarton,
            priceMatrix,
            currencySamplePrice,
            imageType,
            samplePrice: Number(samplePrice),
            price: Number(price),
            moq: Number(moq),
          },
          this.state.editedName
        )
        .subscribe(
          () => {
            onProductCreated.next({
              total: imageStore3.data().length,
            })

            this.setState({
              loading: false,
              // isPressed: false
            })

            this.goToNextScreen()
          },
          error => {
            this.setState({
              loading: false,
              isPressed: false,
            })

            if (error === 'Object has been deleted or invalidated') {
              alert(I18n.t('createProductFailSomeFieldHaveBeenDeleted'))
            } else {
              alert(I18n.t('createProductFail'))
            }
          }
        )
    }, 0)
  }

  goToNextScreen = (nextScreen?: string) => {
    // clean all data selected in modalStore
    modalStore.cleanAllSelectData()

    if (settingStore.copyProduct) {
      this.updateDataToCopyProduct()
      copyProductStore.saveToStore()
    }
    if (nextScreen === 'CameraScreen') {
      this.updateDataToCreateAnother()
      this._navListener.replace(nextScreen, {})
      return
    }

    createProductStore.clear()
    this.props.navigation.goBack(null)
  }

  updateDataToCreateAnother = () => {
    const {
      supplier,
      category,
      tags,
      currency,
      status,
      moq,
      moqDescription,
      harbour,
      incoTerm,
      event,
      projects,
    } = this.state

    createProductStore.setData({
      supplier,
      category,
      tags,
      currency,
      status,
      moq,
      moqDescription,
      harbour,
      incoTerm,
      event,
      projects,
    })
  }

  updateDataToCopyProduct = () => {
    const {
      supplier,
      category,
      tags,
      currency,
      status,
      moq,
      moqDescription,
      harbour,
      incoTerm,
      event,
      projects,
    } = this.state

    copyProductStore.setData({
      supplier,
      category,
      tags,
      currency,
      status,
      moq,
      moqDescription,
      harbour,
      incoTerm,
      event,
      projects,
    })
  }

  // Set Data
  setCurrentRefAndAllowKeyboardAware = (currentRef, allowKeyboardAware) => {
    this.setState({
      currentRef,
      allowKeyboardAware,
    })
  }

  setValue = (data, key, type = 'none') => {
    this.setValueToNavigation(key, type, data)
    this.checkNameEdited(key)
    if (
      type === 'innerCarton' ||
      type === 'masterCarton' ||
      type === 'modalUnit' ||
      type === 'priceMatrix'
    ) {
      this.setState({
        [type]: {
          ...this.state[type],
          [key]: data,
        },
      })
      return
    }

    this.setState({
      [key]: data,
    })
  }

  checkNameEdited = key => {
    if (key !== 'name') return

    this.setState({
      editedName: true,
    })
  }

  setValueToNavigation = (key: string, type: string = 'none', data: any) => {
    if (key === 'description') {
      createProductNavigation.setData(CreateProductData.Description, data)
      return
    }
    if (key === 'tags') {
      createProductNavigation.setData(CreateProductData.Tags, data)
      return
    }
    if (key === 'projects') {
      createProductNavigation.setData(CreateProductData.Projects, data)
      return
    }
    if (key === 'currency') {
      createProductNavigation.setData(CreateProductData.Currency, data)
      return
    }
    if (key === 'status') {
      createProductNavigation.setData(CreateProductData.Status, data)
      return
    }
    if (key === 'unit' && type === 'innerCarton') {
      createProductNavigation.setData(CreateProductData.InnerUnit, data)
      return
    }
    if (key === 'weightUnit' && type === 'innerCarton') {
      createProductNavigation.setData(CreateProductData.InnerWeightUnit, data)
      return
    }
    if (key === 'unit' && type === 'masterCarton') {
      createProductNavigation.setData(CreateProductData.MasterUnit, data)
      return
    }
    if (key === 'weightUnit' && type === 'masterCarton') {
      createProductNavigation.setData(CreateProductData.MasterWeightUnit, data)
      return
    }
    if (key === 'currencySamplePrice') {
      createProductNavigation.setData(
        CreateProductData.currencySamplePrice,
        data
      )
      return
    }
  }

  onPressIconLeft = () => {
    Alert.alert(I18n.t('productDeleteTitle'), I18n.t('productDeleteText'), [
      { text: I18n.t('cancel') },
      {
        text: I18n.t('delete'),
        style: 'destructive',
        onPress: () => {
          this.setState({
            isBack: true,
          })
          modalStore.cleanAllSelectData()
          this.props.navigation.goBack()
        },
      },
    ])
  }

  onAddMore = (images: any) => {
    imageStore3.append(images)
  }

  onPressIconRight = () => {
    this.props.navigation.navigate('CameraScreen', {
      isAddMore: true,
      onAddMore: this.onAddMore,
      forceHideBusinessCard: true,
    })
  }

  renderRightIcon = () => {
    return (
      <View style={styles.iconCamera}>
        <TouchableOpacity
          style={styles.wrapIcon}
          activeOpacity={0.8}
          onPress={this.onPressIconRight}
        >
          <Image
            source={images.camera}
            resizeMode={'contain'}
            style={styles.rightIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { allowKeyboardAware, loading, isPressed } = this.state
    createProductNavigation.setData(
      CreateProductData.priceMatrix,
      this.state.priceMatrix
    )

    return (
      <CreateProductContext.Provider
        value={{
          ...this.state,
          setCurrentRefAndAllowKeyboardAware: this
            .setCurrentRefAndAllowKeyboardAware,
          setValue: this.setValue,
        }}
      >
        <View style={styles.container}>
          <CreateProductHeader
            onPressIconLeft={this.onPressIconLeft}
            backButtonIOSTitle={I18n.t('cancel')}
            renderRight={this.renderRightIcon}
          />

          <CreateProductContent allowKeyboardAware={allowKeyboardAware} />

          <AActionBarAvoidKeyboard
            onMove={createProductNavigation.moveHandler}
            onClear={createProductNavigation.clearHandler}
          />

          <CreateProductButton
            onSave={this.onCreate}
            isPressed={isPressed}
            loadingCreate={loading}
          />
        </View>
      </CreateProductContext.Provider>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border_header,
  },
  rightIcon: {
    resizeMode: 'contain',
    tintColor: colors.back_button_ios_color,
    width: metrics.aheader_icon_width,
    height: metrics.aheader_icon_height,
  },
  scrollView: {
    backgroundColor: colors.white,
  },
  wrapIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCamera: {
    flex: 0.5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})
