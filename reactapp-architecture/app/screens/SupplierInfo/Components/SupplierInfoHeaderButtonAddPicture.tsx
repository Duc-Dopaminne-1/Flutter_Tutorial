import I18n from '@/i18n'
import { Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { devices, fonts } from '@/vars'
import { colors } from '@/vars/colors'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { withNavigation } from 'react-navigation'
import { CameraMode } from '@/common/constants/CameraMode'

// init state
const initialState = {
  data: [],
  isVisible: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Readonly<{
  supplier?: Supplier
}> &
  DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState>

@(withNavigation as any)
export class SupplierInfoHeaderButtonAddPicture extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = initialState

  addPhoto = () => {
    const { navigation, supplier } = this.props

    navigation.navigate('CameraScreen', {
      supplier,
      cameraMode: CameraMode.Supplier,
      isAddSupplierPhoto: true,
    })
  }

  render() {
    return (
      <View
        style={[
          devices.isAndroid ? styles.containerAndroid : styles.containerIOS,
        ]}
      >
        <TouchableOpacity style={styles.button} onPress={this.addPhoto}>
          <Text style={styles.buttonText}>{I18n.t('addPicture')}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  containerIOS: {
    position: 'absolute',
    top: -105,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  containerAndroid: {
    width: '100%',
    height: 210,
    backgroundColor: colors.background_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 32,
    backgroundColor: colors.pale_grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.blue_light_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
