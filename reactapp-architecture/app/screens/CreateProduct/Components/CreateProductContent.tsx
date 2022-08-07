import * as React from 'react'
import { CreateProductImage } from '@/screens/CreateProduct/Components/CreateProductImage'
import { CreateProductMultiOption } from '@/screens/CreateProduct/Components/CreateProductMultiOption'
import { CreateProductDescription } from '@/screens/CreateProduct/Components/CreateProductDescription'
import { CreateProductSupplier } from '@/screens/CreateProduct/Components/CreateProductSupplier'
import { CreateProductCategory } from '@/screens/CreateProduct/Components/CreateProductCategory'
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native'
import { CreateProductTags } from '@/screens/CreateProduct/Components/CreateProductTags'
import { CreateProductProjects } from '@/screens/CreateProduct/Components/CreateProductProjects'
import { CreateProductDetails } from '@/screens/CreateProduct/Components/CreateProductDetails'
import { CreateProductCustomField } from '@/screens/CreateProduct/Components/CreateProductCustomField'
import { CreateProductTradingInnerCarton } from '@/screens/CreateProduct/Components/CreateProductTradingInnerCarton'
import { CreateProductTradingMasterCarton } from '@/screens/CreateProduct/Components/CreateProductTradingMasterCarton'
import { CreateProductPriceMatrix } from '@/screens/CreateProduct/Components/CreateProductPriceMatrix'
import { CreateProductSamplePrice } from '@/screens/CreateProduct/Components/CreateProductSamplePrice'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { colors } from '@/vars'

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  allowKeyboardAware: any
} & DefaultProps

export class CreateProductContent extends React.PureComponent<Props> {
  onPress = () => {
    Keyboard.dismiss()
  }

  render() {
    const { allowKeyboardAware } = this.props

    return (
      <KeyboardAwareScrollView
        extraScrollHeight={60}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}
        enableAutomaticScroll={allowKeyboardAware}
        keyboardShouldPersistTaps={'always'}
        style={styles.scrollView}
      >
        <CreateProductImage />
        <CreateProductMultiOption />

        <View style={styles.container}>
          <CreateProductDescription />
          <CreateProductSupplier />
          <CreateProductCategory />
        </View>

        <CreateProductTags />
        <CreateProductProjects />

        <TouchableOpacity
          activeOpacity={1}
          style={styles.container}
          onPress={this.onPress}
        >
          <CreateProductDetails />
          <CreateProductCustomField />
          <CreateProductTradingInnerCarton />
          <CreateProductTradingMasterCarton />
          <CreateProductPriceMatrix />
          <CreateProductSamplePrice />
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create<any>({
  scrollView: {
    backgroundColor: colors.white,
  },
  container: {
    paddingHorizontal: 12,
  },
})
