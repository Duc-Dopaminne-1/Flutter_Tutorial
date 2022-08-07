import I18n from '@/i18n'
import { Contact, Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { CreateContactActions } from '@/screens/CreateContact/Components/CreateContactActions'
import { CreateContactCover } from '@/screens/CreateContact/Components/CreateContactCover'
import { NavigationService } from '@/services/navigation'
import { SafeContact } from '@/shared/contact'
import { isValidEmail, isValidPhoneNumber } from '@/shared/validator'
import { withContext } from '@/shared/withContext'
import { colors, devices, metrics } from '@/vars'
import * as React from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { Subscription } from 'rxjs'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'
import { CameraMode } from '@/common/constants/CameraMode'
import { debounce } from 'lodash'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { CustomAlert } from '@/shared/alert'
import { lCache } from '@/libs/LCache'
import { Source } from '@/stores/imageStore3'
import { SafeSupplier } from '@/shared/supplier'
import { setLoadingSnapImageBusinessCard } from '@/services/global'
import { cameraStore } from '@/stores/cameraStore'
import {
  contactNavigation,
  ContactNavigationData,
} from '@/navigation/contactNavigation'
import { Direction } from '@/common/constants/Direction'
import { SafeImage } from '@/shared/image'
import { CreateContactHeader } from '@/screens/CreateContact/Components/CreateContactHeader'
import { CreateContactContentHeader } from '@/screens/CreateContact/Components/CreateContactContentHeader'
import { CreateContactForm } from '@/screens/CreateContact/Components/CreateContactForm'

type Props = Readonly<{}> &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      newBusinessCard: boolean
      createBusinessCard: boolean
      imageData: Source
      supplier: Supplier
      contactId: string
      headerTitle: string
      contact: Contact
      routeKey: string
    }>
  >

type State = Readonly<{
  [key: string]: any
  businessCardImage: any
  name: string
  jobTitle: string
  email: string
  phoneNumber: string
  contact: Contact
  headerTitle: string
  thumbnail: Source
  uploading: boolean
  isSave: boolean
  isSaveImage: boolean
  supplier: Supplier
  loadingSelectImage: boolean
}>

const DEFAULT_CONTACT_NAME = 'New Contact'

@withContext(AppContext.Consumer)
@(withNavigation as any)
export class CreateContactScreen extends React.PureComponent<Props, State> {
  _navListener = new NavigationService(this.props.navigation)
  isContactSelectImage = false

  _fetchSubscription: Subscription
  _upsertSubscription: Subscription
  _setLoadingSnapImageBusinessCardSubscription: Subscription
  _onSuccessSubscription: Subscription

  _fetchedResults: Realm.Results<Contact>

  _timer: NodeJS.Timeout
  _isDeletedByMyself = false

  _isCreateContact: boolean = false
  _isBack: boolean = false
  _isShowAlert: boolean = false

  readonly state: State = {
    businessCardImage: '',
    name: DEFAULT_CONTACT_NAME,
    jobTitle: '',
    email: '',
    phoneNumber: '',
    contact: null,
    headerTitle: 'Contact',
    thumbnail: [],
    uploading: false,
    isSave: false,
    supplier: null,
    isSaveImage: false,
    loadingSelectImage: false,
  }

  componentDidMount() {
    this.initScreen()
    this.initNewBusinessCard()
    this.initContact()
  }

  componentWillUnmount() {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    this._fetchSubscription && this._fetchSubscription.unsubscribe()
    this._upsertSubscription && this._upsertSubscription.unsubscribe()
    this._setLoadingSnapImageBusinessCardSubscription &&
      this._setLoadingSnapImageBusinessCardSubscription.unsubscribe()

    this._fetchedResults && this._fetchedResults.removeAllListeners()

    clearTimeout(this._timer)
    this._onSuccessSubscription && this._onSuccessSubscription.unsubscribe()
  }

  navigationData = () => {
    const { navigation } = this.props

    const contactId = navigation.getParam('contactId', '')
    const newBusinessCard = navigation.getParam('newBusinessCard', false)
    const createBusinessCard = navigation.getParam('createBusinessCard', false)
    const imageData = navigation.getParam('imageData', [])
    const supplier = navigation.getParam('supplier')
    const headerTitle = navigation.getParam('headerTitle', '')
    const contact = navigation.getParam('contact', null)

    return {
      contactId,
      newBusinessCard,
      createBusinessCard,
      imageData,
      supplier,
      headerTitle,
      contact,
      isCreateContact: !contact,
    }
  }

  initScreen = () => {
    const { headerTitle, supplier } = this.navigationData()

    this.setState({ headerTitle, supplier })

    this._navListener.setBarStyle('dark-content')
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustResize()
    contactNavigation.setData(ContactNavigationData.SetValue, this.setValue)
    this._onSuccessSubscription = cameraStore.observer.subscribe(this.initImage)

    this._setLoadingSnapImageBusinessCardSubscription = setLoadingSnapImageBusinessCard.subscribe(
      value => {
        this.setState({
          loadingSelectImage: value,
        })
      }
    )
  }

  initNewBusinessCard = () => {
    const { name } = this.state
    const { newBusinessCard, imageData } = this.navigationData()

    if (!newBusinessCard || name !== DEFAULT_CONTACT_NAME) return

    this.setState({
      name: '',
      thumbnail: imageData,
    })

    this.isContactSelectImage = true
  }

  initContact = () => {
    const { contactId } = this.navigationData()
    const { contactFactory } = this.props

    if (!contactId) return

    const [subscription, results] = contactFactory.fetchById(contactId)

    this._fetchedResults = results

    this._fetchSubscription = subscription.subscribe(contact => {
      this.setContactData(contact)
      this.setContactInfo(contact)
    })
  }

  initImage = data => {
    const { contactFactory } = this.props
    const { supplier, name } = this.state
    const { contactId, isCreateContact } = this.navigationData()

    if (isCreateContact) {
      this.isContactSelectImage = true
      this.setState({
        uploading: false,
        loadingSelectImage: false,
        thumbnail: [data[data.length - 1]],
        name: name === DEFAULT_CONTACT_NAME ? '' : name,
        headerTitle: this.isDirty ? I18n.t('contact') : I18n.t('businessCard'),
      })

      return
    }

    this._upsertSubscription = contactFactory
      .upsert(contactId, {
        supplier,
        imageData: data,
      })
      .subscribe(
        createdContact => {
          this.setContactData(createdContact)
          lCache.clear()
          cameraStore.clear()
        },
        error => {
          console.log(error)
        }
      )
  }

  isValidContact = (contact: Contact) => {
    return contact && contact.isValid()
  }

  setContactData = (contact: Contact) => {
    if (this.isValidContact(contact)) {
      clearTimeout(this._timer)

      this.setState({
        contact,
      })
    } else {
      this.showAlert()
    }
  }

  showAlert = () => {
    this._timer = setTimeout(() => {
      if (!this._isDeletedByMyself) {
        CustomAlert.error({
          message: I18n.t('thisContactWasDeleted'),
          onPress: () => {
            contactNavigation.closeAll()

            setTimeout(() => {
              this.props.navigation.goBack()
            }, 200)
          },
        })
      }
    }, 0)
  }

  setContactInfo = (contact: Contact) => {
    if (!this.isValidContact(contact)) return

    const name = contact.name ? contact.name : DEFAULT_CONTACT_NAME

    this.setState({
      name,
      jobTitle: contact.jobTitle ? contact.jobTitle : '',
      email: contact.email ? contact.email : '',
      phoneNumber: contact.phoneNumber ? contact.phoneNumber : '',
    })
  }

  setValue = (supplier: Supplier) => {
    const { contactFactory } = this.props
    const { contact } = this.state

    this.setState({ supplier })

    if (!this.isValidContact(contact)) return

    this._upsertSubscription = contactFactory
      .upsert(contact.id, {
        supplier,
      })
      .subscribe(createdContact => {
        this.setContactInfo(createdContact)
      })
  }

  alert = (message: string) => {
    if (this._isBack) return

    this._isShowAlert = true
    Alert.alert(
      null,
      message,
      [
        {
          text: 'Ok',
          onPress: () => {
            this._isShowAlert = false
          },
        },
      ],
      { cancelable: false }
    )
  }

  checkValidate = (isSubmitEditing: boolean = false) => {
    const {
      name,
      jobTitle,
      email,
      phoneNumber,
      thumbnail,
      contact,
    } = this.state
    const hasAnotherFields = [jobTitle, email, phoneNumber].some(
      value => !!value.trim()
    )

    if (this._isShowAlert) return false

    const { businessCardImage } = new SafeContact(contact)

    if (
      businessCardImage.id === '' &&
      thumbnail.length === 0 &&
      (!name ||
        !name.trim() ||
        (name.trim() === DEFAULT_CONTACT_NAME && !hasAnotherFields))
    ) {
      !isSubmitEditing && this.alert(I18n.t('pleaseAddNameOrTakePhoto'))
      return false
    }

    if (name && name.trim() === DEFAULT_CONTACT_NAME) {
      if (
        !hasAnotherFields &&
        (businessCardImage.id === '' && thumbnail.length === 0)
      ) {
        !isSubmitEditing && this.alert(I18n.t('pleaseChangeToAnotherName'))
        return false
      }
    }

    if (!name || name.trim() === '') {
      if (hasAnotherFields) {
        !isSubmitEditing && this.alert(I18n.t('pleaseAddName'))
        return false
      }
    }

    if (
      email === null ||
      email === undefined ||
      (email !== '' && !isValidEmail(email))
    ) {
      !isSubmitEditing && this.alert(I18n.t('emailInvalid'))
      return false
    }

    if (
      phoneNumber === null ||
      phoneNumber === undefined ||
      (phoneNumber !== '' && !isValidPhoneNumber(phoneNumber))
    ) {
      !isSubmitEditing && this.alert(I18n.t('phoneNumberInvalid'))
      return false
    }

    return true
  }

  checkSupplier = () => {
    const { supplier } = this.state

    if (!supplier) {
      this.alert(I18n.t('dontHaveAnySupplier'))
      return false
    }

    return true
  }

  onDelete = () => {
    const { contactFactory, navigation } = this.props
    const { contact } = this.state

    if (!this.isValidContact(contact)) {
      return null
    }

    if (!contact || !contact.id) {
      return
    }

    this._upsertSubscription = contactFactory
      .upsert(contact.id, {
        deleted: true,
      })
      .subscribe(() => {
        setTimeout(() => {
          this._isDeletedByMyself = true
          navigation.goBack()
        }, 10)
      })
  }

  onSave = debounce(() => {
    const { contactFactory } = this.props
    const { isCreateContact } = this.navigationData()
    const {
      contact,
      name,
      jobTitle,
      email,
      phoneNumber,
      isSave,
      supplier,
    } = this.state

    if (!this.isValidContact(contact) && !isCreateContact) {
      return null
    }

    const contactId = contact && contact.id

    if (!this.checkValidate() || isSave || !this.checkSupplier()) return

    this.setState({
      isSave: true,
    })

    const imageData =
      cameraStore.data && cameraStore.data.length
        ? [cameraStore.data[cameraStore.data.length - 1]]
        : []

    this._upsertSubscription = contactFactory
      .upsert(contactId, {
        supplier,
        imageData,
        name: name.trim(),
        jobTitle: jobTitle ? jobTitle.trim() : '',
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
      })
      .subscribe(createdContact => {
        this.setContactData(createdContact)
        this.setContactInfo(createdContact)
        this._isBack = true
        lCache.clear()
        cameraStore.clear()
        this.props.navigation.goBack(null)
      })
  }, 100)

  onEndEditing = (key: string) => () => {
    const { contactFactory } = this.props
    const { isCreateContact } = this.navigationData()
    const { supplier, contact } = this.state
    const value = this.state[key]
    const isValidate = this.checkValidate()

    if (!isValidate) {
      this.setState({
        [key]: contact && contact[key] ? contact[key] : '',
      })
      return
    }

    if (isCreateContact || !this.isValidContact(contact)) {
      return
    }

    const hasAnotherFields = [
      this.state.jobTitle,
      this.state.email,
      this.state.phoneNumber,
    ].some(value => !!value.trim())

    if (this.state.name === DEFAULT_CONTACT_NAME && hasAnotherFields) {
      this._upsertSubscription = contactFactory
        .upsert(contact.id, {
          supplier,
          name: this.state.name,
          [key]: value ? value.trim() : '',
        })
        .subscribe(createdContact => {
          this.setContactInfo(createdContact)
        })
      return
    }

    this._upsertSubscription = contactFactory
      .upsert(contact.id, {
        supplier,
        [key]: value ? value.trim() : '',
      })
      .subscribe(createdContact => {
        this.setContactInfo(createdContact)
      })
  }

  onSubmitEditing = () => {
    const isValidate = this.checkValidate(true)

    if (isValidate) {
      !this._isBack && contactNavigation.moveHandler(Direction.Down)
    }
  }

  onChangeText = (key: string) => (value: string) => {
    this.setState({
      [key]: value,
      headerTitle: this.isDirty ? 'Contact' : 'Business Card',
    })
  }

  onSnapBusinessCard = () => {
    const { navigation } = this.props
    const { createBusinessCard } = this.navigationData()
    const { contact, thumbnail } = this.state
    const { businessCardImage } = new SafeContact(contact)
    const { id, uri } = new SafeImage(businessCardImage)

    this.setState({
      loadingSelectImage: true,
    })

    if (thumbnail.length <= 0 && !id) {
      navigation.navigate('CameraScreen', {
        cameraMode: CameraMode.BusinessCard,
        isAddContactPicture: true,
        maxFiles: 1,
      })

      return
    }

    if (id) {
      navigation.navigate('BusinessCardPictureScreen', {
        createBusinessCard,
        image: { id, uri },
      })
      return
    }

    if (thumbnail[0] && thumbnail[0].id) {
      navigation.navigate('BusinessCardPictureScreen', {
        createBusinessCard,
        image: { id: thumbnail[0].id, uri: '' },
      })
      return
    }
  }

  onPressIconLeft = debounce(() => {
    const { navigation } = this.props

    this._isBack = true
    navigation.goBack(null)
  }, 100)

  onPressGoBack = () => {
    const { goBack } = this.props.navigation
    const { createBusinessCard } = this.navigationData()

    createBusinessCard ? lCache.cleanCache() : lCache.clear()

    cameraStore.clear()
    this._isBack = true
    goBack(null)
  }

  get isDirty() {
    const { name, jobTitle, email, phoneNumber } = this.state
    const safeContact = new SafeContact({
      name,
      jobTitle,
      email,
      phoneNumber,
    } as any)

    return safeContact.isDirty
  }

  render() {
    const { isCreateContact } = this.navigationData()
    const {
      name,
      jobTitle,
      email,
      phoneNumber,
      headerTitle,
      thumbnail,
      supplier,
      contact,
      loadingSelectImage,
    } = this.state

    const supplierName = new SafeSupplier(supplier).name

    if (contact && !contact.isValid()) return null

    const { businessCardImage } = new SafeContact(contact)

    return (
      <View style={styles.container}>
        <CreateContactHeader
          isCreateContact={isCreateContact}
          headerTitle={headerTitle}
          loadingSelectImage={loadingSelectImage}
          onPressLeftWhenCreate={this.onPressGoBack}
          onPressLeftWhenUpdate={this.onPressIconLeft}
          onPressRight={this.onSave}
        />

        <CreateContactCover
          onPress={this.onSnapBusinessCard}
          thumbnail={thumbnail}
          image={businessCardImage}
          id={businessCardImage.id}
          isContactSelectImage={this.isContactSelectImage}
        />

        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          enableResetScrollToCoords={false}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps={'always'}
        >
          <CreateContactContentHeader
            contactName={name}
            jobTitle={jobTitle}
            supplier={supplier}
          />

          <CreateContactActions
            email={email}
            phoneNumber={phoneNumber}
            name={name}
            onDelete={this.onDelete}
          />

          <CreateContactForm
            onChangeText={this.onChangeText}
            onEndEditing={this.onEndEditing}
            onSubmitEditing={this.onSubmitEditing}
            name={name}
            jobTitle={jobTitle}
            email={email}
            phoneNumber={phoneNumber}
            supplierName={supplierName}
          />
        </KeyboardAwareScrollView>

        <ANetworkStatus />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    backgroundColor: colors.white,
    marginTop: 16,
  },
  scrollViewContent: {
    paddingBottom: 95,
  },
})
