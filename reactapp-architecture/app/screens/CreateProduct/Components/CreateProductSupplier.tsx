import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { withContext } from '@/shared/withContext'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import { colors, fonts, images, metrics } from '@/vars'
import { Supplier } from '@/models/team'
import I18n from '@/i18n'
import { SafeSupplier } from '@/shared/supplier'
import { ATextTitle } from '@/components/AText/ATextTitle'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { ADataRowEmpty } from '@/components/ADataRow/ADataRowEmpty'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  supplier?: Supplier
  openModal?: (key) => void
} & DefaultProps

export type State = Readonly<typeof initialState>

@withContext(CreateProductContext.Consumer)
export class CreateProductSupplier extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  openModal = () => {
    createProductNavigation.open(CreateProductRef.SelectSupplier)
  }

  get hasData() {
    return this.props.supplier
  }

  render() {
    const { supplier } = this.props

    if (!this.hasData || !supplier || !supplier.isValid() || supplier.deleted) {
      return (
        <ADataRowEmpty
          title={I18n.t('supplier')}
          description={I18n.t('noSupplierYet')}
          buttonText={I18n.t('select')}
          onPress={this.openModal}
          containerStyle={{ paddingTop: 24 }}
        />
      )
    }

    const { name } = new SafeSupplier(supplier)

    return (
      <View style={styles.container}>
        <ATextTitle
          title={I18n.t('supplier')}
          buttonText={I18n.t('change')}
          onPress={this.openModal}
        />

        <View style={styles.wrapSupplier}>
          <View style={styles.wrapIcon}>
            <Image source={images.supplier} style={styles.icon} />
          </View>
          <Text style={styles.text} numberOfLines={1}>
            {name}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    paddingTop: 24,
  },
  wrapSupplier: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: metrics.double_base,
  },
  wrapIcon: {
    height: 16,
    width: 16,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: colors.background_violet,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 11,
    width: 11,
    tintColor: colors.white,
  },
  text: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.black_blue_text,
  },
})
