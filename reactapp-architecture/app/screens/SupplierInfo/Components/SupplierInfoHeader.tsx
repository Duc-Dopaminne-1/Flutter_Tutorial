import { Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SupplierInfoHeaderAction } from '@/screens/SupplierInfo/Components/SupplierInfoHeaderAction'
import { SupplierInfoHeaderButtonAddPicture } from '@/screens/SupplierInfo/Components/SupplierInfoHeaderButtonAddPicture'
import { SupplierInfoHeaderLogo } from '@/screens/SupplierInfo/Components/SupplierInfoHeaderLogo'
import { SupplierInfoHeaderStatus } from '@/screens/SupplierInfo/Components/SupplierInfoHeaderStatus'
import { SupplierInfoHeaderTitle } from '@/screens/SupplierInfo/Components/SupplierInfoHeaderTitle'
import { SupplierInfoContext } from '@/screens/SupplierInfo/SupplierInfoContext'
import { SafeSupplier } from '@/shared/supplier'
import { withContext } from '@/shared/withContext'
import { colors, devices, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { CameraMode } from '@/common/constants/CameraMode'
import { Subscription } from 'rxjs'
import { imageDataSupplierSubject } from '@/services/global'
import { Platforms } from '@/shared/platforms'

type Props = Readonly<{
  supplier?: Supplier
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

@withContext(AppContext.Consumer)
@withContext(SupplierInfoContext.Consumer)
@(withNavigation as any)
export class SupplierInfoHeader extends React.PureComponent<Props> {
  _subscription: Subscription

  state = {
    hasImage: false,
  }

  componentDidMount() {
    const {
      images: { all },
    } = new SafeSupplier(this.props.supplier)

    this.setState({
      hasImage: all.length > 0,
    })

    this._subscription = imageDataSupplierSubject.subscribe(data => {
      if (data.imageData.length > 0) {
        this.setState({
          hasImage: true,
        })
      }
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  get hasImage() {
    const {
      images: { all },
    } = new SafeSupplier(this.props.supplier)
    const { hasImage } = this.state

    return all.length > 0 || hasImage
  }

  addPhoto = () => {
    const { navigation, supplier } = this.props

    navigation.navigate('CameraScreen', {
      supplier,
      cameraMode: CameraMode.Supplier,
      isAddSupplierPhoto: true,
    })
  }

  render() {
    const { supplier } = this.props

    return (
      <View style={styles.container}>
        {!this.hasImage && devices.isIOS && (
          <SupplierInfoHeaderButtonAddPicture supplier={supplier} />
        )}
        <SupplierInfoHeaderLogo />
        <SupplierInfoHeaderStatus />
        <SupplierInfoHeaderTitle />
        <SupplierInfoHeaderAction addPhoto={this.addPhoto} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: -8,
    backgroundColor: colors.white,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    ...Platforms.shared().select({
      android: {
        borderRadius: 8,
      },
      ios: {
        borderRadius: 8,
      },
    }),
  },
})
