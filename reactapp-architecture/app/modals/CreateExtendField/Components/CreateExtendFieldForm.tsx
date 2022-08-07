import { SupplierCard } from '@/cards/Supplier/SupplierCard'
import { SupplierCardSeparator } from '@/cards/Supplier/SupplierCardSeparator'
import { ABooth } from '@/components/ABooth/ABooth'
import { AButtonCreate } from '@/components/AButton/AButtonCreate'
import I18n from '@/i18n'
import { Supplier } from '@/models/team'
import { ifIphoneX } from '@/shared/devices'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { FlatList, Keyboard, StyleSheet, Text, View } from 'react-native'
import { CreateSupplierPlaceholder } from '@/modals/CreateSupplier/Components/CreateSupplierPlaceholder'
import { AInputOne } from '@/components/AInput/AInputOne'
import { AButton } from '@/components/AButton/AButton'

type Props = {
  type: string
  order: string
  label: string
  onChangeText: (key: string) => (value: string) => void
  submit: () => void
}

export class CreateExtendFieldForm extends React.PureComponent<Props> {
  static readonly defaultProps = {}

  render() {
    const { type, order, label, onChangeText, submit } = this.props

    return (
      <View style={styles.container}>
        {/* Type */}
        <AInputOne
          title={'Type'}
          value={type}
          textInputProps={{
            placeholder: 'text, price, decimal, int, tel, boolean',
          }}
          onChangeText={onChangeText('type')}
        />

        {/* order */}
        <AInputOne
          title={'Order'}
          value={order}
          textInputProps={{
            keyboardType: 'numeric',
            placeholder: 'The order in which the fields must be listed',
          }}
          onChangeText={onChangeText('order')}
          containerStyle={styles.customTextInputContainer}
        />

        {/* Label */}
        <AInputOne
          title={'Label'}
          value={label}
          textInputProps={{
            placeholder: 'The label of the input',
          }}
          onChangeText={onChangeText('label')}
          containerStyle={styles.customTextInputContainer}
        />

        <AButton
          onPress={submit}
          title={I18n.t('add')}
          containerStyle={styles.customButtonContainer}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    padding: metrics.keylines_screen_profile_title_margin,
  },
  customTextInputContainer: {
    marginTop: metrics.base,
  },
  customButtonContainer: {
    marginTop: 40,
    borderRadius: 10,
    height: 45,
  },
})
