import * as React from 'react'
import {
  Keyboard,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { Team, User } from '@/models/common'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { CreateSampleList } from './Components/CreateSampleList'
import { Product, SampleStatus } from '@/models/team'
import { metrics, devices, fonts, colors } from '@/vars'
import { Toast, onItemCreated } from '@/services/global'

// default props
const defaultProps = {
  isUpdateSuccess: () => {},
}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<
  NavigationInjectedProps<{
    productsId?: string[]
    suppliersId?: string[]
    isUpdateSuccess?: () => void
    product?: Product
  }>
> &
  DefaultProps &
  AppContextState

export type State = {
  selectedUserId: string | number
  selectedUser: User
  selectedPreset?: string
  status?: SampleStatus
  showPresets?: boolean
}

const PRESETS = [
  I18n.t('sampleCreateOrder'),
  I18n.t('sampleCreateReceived'),
  I18n.t('sampleCreateProduction'),
  I18n.t('sampleCreateOther'),
]

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class CreateSamplePicker extends React.PureComponent<Props, State> {
  _teamMembersResults: Realm.Results<Team>
  _teamMembersSubscription: Subscription
  _modal

  state: State = {
    selectedUserId: null,
    selectedUser: undefined,
    selectedPreset: null,
    showPresets: true,
    status: null,
  }

  componentDidMount() {
    this.open()
  }

  onCreate = ({ sampleName }) => {
    const { sampleFactory, navigation, productFactory } = this.props
    const { selectedUser, status } = this.state

    const productsId = navigation.getParam('productsId', [])
    const suppliersId = navigation.getParam('suppliersId', [])
    if (suppliersId.length > 0) {
      sampleFactory
        .createMultiSupplier({
          suppliersId,
          assignee: selectedUser && selectedUser._user,
          status,
          name: sampleName,
          description: undefined,
        })
        .subscribe(() => {})
      this.close()

      Toast.next({
        message: I18n.t('samplesCreated', {
          total: suppliersId.length,
          isMany: suppliersId.length === 1 ? '' : 's',
        }),
      })

      const isUpdateSuccess = navigation.getParam('isUpdateSuccess', () => {})
      isUpdateSuccess && isUpdateSuccess()
      return
    }
    if (productsId.length > 0) {
      sampleFactory
        .createMulti({
          productsId,
          assignee: selectedUser && selectedUser._user,
          status,
          name: sampleName,
          description: undefined,
        })
        .subscribe(() => {})
      this.close()

      Toast.next({
        message: I18n.t('samplesCreated', {
          total: productsId.length,
          isMany: productsId.length === 1 ? '' : 's',
        }),
      })

      const isUpdateSuccess = navigation.getParam('isUpdateSuccess', () => {})
      isUpdateSuccess && isUpdateSuccess()
      return
    }

    const product = navigation.getParam('product')
    const supplier = product && product.supplier ? product.supplier : null
    sampleFactory
      .create({
        product,
        supplier,
        status,
        assignee: selectedUser && selectedUser._user,
        name: sampleName,
        description: undefined,
      })
      .subscribe(
        sample => {
          onItemCreated.next({
            sample,
            type: 'sample',
            id: sample ? sample.id : null,
          })
          this.close()
        },
        () => {
          this.close()
        }
      )
  }

  open = () => {
    this._modal && this._modal.open()
  }

  close = () => {
    this._modal && this._modal.close()
  }

  onUserSelect = (user: User) => {
    this.setState({ selectedUser: user, selectedUserId: user.id })
  }

  onSelectPreset = (preset: string) => {
    const selectedPreset =
      preset === I18n.t('sampleCreateOther') ? undefined : preset
    this.setState({ selectedPreset, showPresets: false })
  }

  setStatus = (status: SampleStatus) => {
    this.setState({ status })
  }

  onShowPicker = (type: string) => {
    Keyboard.dismiss()
    if (type === 'reAssign') {
      this.props.navigation.navigate('SelectUserPicker', {
        onUserSelect: this.onUserSelect,
        selected: this.state.selectedUser,
        hideUpDownClear: true,
      })
      return
    }
    if (type === 'status') {
      const screenHeight = metrics.screen_height
      const marginTop = Math.round((screenHeight * 10) / 9) / 10
      this.props.navigation.navigate('SelectStatusPickerSample', {
        status: this.state.status,
        hideUpDownClear: true,
        hideActionBar: devices.isAndroid,
        isCreateSample: true,
        setValue: () => null,
        onCloseStatusPicker: this.setStatus,
        modalProps: {
          height: screenHeight - marginTop,
          style: {
            marginTop,
          },
        },
      })
    }
  }

  renerContent = () => {
    const { selectedUser, selectedPreset, showPresets, status } = this.state
    if (showPresets) {
      return (
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={styles.title}>{I18n.t('presets')}</Text>
          {PRESETS.map(preset => {
            return (
              <TouchableOpacity
                key={preset}
                style={styles.preset}
                onPress={() => this.onSelectPreset(preset)}
              >
                <Text style={styles.text}>{preset}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )
    }
    return (
      <CreateSampleList
        onCreate={this.onCreate}
        assignee={selectedUser}
        onShowPicker={this.onShowPicker}
        sampleName={selectedPreset}
        status={status}
      />
    )
  }

  render() {
    const screenHeight = metrics.screen_height

    return (
      <React.Fragment>
        <AModal3
          ref={nodeRef => (this._modal = nodeRef)}
          headerProps={{
            title: I18n.t('sampleCreateNew'),
            onPressIconRight: this.close,
          }}
          textInputType="none"
          hideActionBar={true}
          pointerEvents="box-none"
          modalProps={{
            height: screenHeight * 0.76,
            style: {
              marginTop: screenHeight * 0.24,
            },
          }}
        >
          {this.renerContent()}
        </AModal3>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create<any>({
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
    color: colors.black_blue_text,
    marginBottom: 24,
  },
  preset: {
    backgroundColor: colors.close_icon_gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingVertical: 9,
    borderRadius: 4,
  },
  text: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
    color: colors.blue_light_grey,
    textAlign: 'center',
  },
})
