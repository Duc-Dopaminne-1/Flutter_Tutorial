import { AButton } from '@/components/AButton/AButton'
import I18n from '@/i18n'
import { PriceMatrix, Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SafePriceMatrix } from '@/shared/priceMatrix'
import { SafeProduct } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { mergeMap } from 'rxjs/operators'
import { ProductInfoTradingListItem } from './ProductInfoTradingListItem'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'

// init state
const initialState = {
  priceMatrix: {
    rows: [],
  } as any,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  product: Product
  safeProduct?: SafeProduct
  inputRefs?: React.RefObject<any>[]
} & DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState> &
  Readonly<{
    priceMatrix: PriceMatrix
  }>

@withContext(AppContext.Consumer)
@withContext(ProductInfoContext.Consumer)
export class ProductInfoTradingPriceMatrix extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = initialState

  static getDerivedStateFromProps(props) {
    return {
      priceMatrix: new SafePriceMatrix(props.product.priceMatrix),
    }
  }

  renderItem = ({ item, index }) => {
    return (
      <ProductInfoTradingListItem
        data={item}
        index={index}
        onSubmit={this.onSubmit}
      />
    )
  }

  onSubmit = (idRow: string, key: string, updateValue: any) => {
    const { product, priceMatrixFactory, priceMatrixRowFactory } = this.props
    const { priceMatrix } = this.state

    if (priceMatrix.id) {
      if (idRow) {
        priceMatrixRowFactory
          .update(idRow, { [key]: updateValue[key] })
          .subscribe(() => {})
      }
    } else {
      if (priceMatrix.rows && priceMatrix.rows[0] && priceMatrix.rows[0].id) {
        priceMatrixFactory
          .createAndUpdateProduct(product.id)
          .pipe(
            mergeMap(priceMatrix => {
              return priceMatrixRowFactory.update(priceMatrix.rows[0].id, {
                [key]: updateValue[key],
              })
            })
          )
          .subscribe(() => {})
      }
    }
  }

  addLine = () => {
    const { product, priceMatrixFactory, safeProduct } = this.props
    const { currency } = safeProduct
    const { priceMatrix } = this.state

    if (priceMatrix.id) {
      priceMatrixFactory
        .addRow(priceMatrix.id, priceMatrix.rows, currency.currency)
        .subscribe(() => {})
    } else {
      priceMatrixFactory.createAndUpdateProduct(product.id).subscribe(() => {})
    }
  }

  render() {
    const { priceMatrix } = this.state

    return (
      <>
        <View style={styles.container}>
          <Text style={styles.title}>{I18n.t('priceMatrix')}</Text>
          <FlatList
            renderItem={this.renderItem}
            data={priceMatrix.rows}
            extraData={priceMatrix.rows}
            keyExtractor={(item, index) =>
              item.id ? item.id : index.toString()
            }
            scrollEnabled={false}
            listKey={'PriceMatrix'}
          />
        </View>

        <AButton
          title={I18n.t('addLine')}
          onPress={this.addLine}
          containerStyle={styles.buttonContainer}
          titleStyle={styles.buttonTitle}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.double_base,
  },
  title: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
  buttonContainer: {
    height: 32,
    margin: 0,
    marginTop: metrics.medium_base,
    backgroundColor: colors.background,
  },
  buttonTitle: {
    color: colors.blue_light_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
