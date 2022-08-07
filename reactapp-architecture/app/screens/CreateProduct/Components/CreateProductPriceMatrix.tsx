import { AButton } from '@/components/AButton/AButton'
import I18n from '@/i18n'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { CreateProductPriceMatrixListItem } from './CreateProductPriceMatrixListItem'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  priceMatrix?: any
  currency?: string
  setValue?: (data, key, type) => void
} & DefaultProps

export type State = Readonly<typeof initialState>

@DelayRender({ delay: 300 })
@withContext(CreateProductContext.Consumer)
export class CreateProductPriceMatrix extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = initialState

  renderItem = ({ item, index }) => {
    return (
      <CreateProductPriceMatrixListItem
        data={item}
        index={index}
        submit={this.submit}
      />
    )
  }

  submit = (indexRow: number, key: string, data: any) => {
    const { priceMatrix, setValue } = this.props
    const newPriceMatrixRows = [...priceMatrix.rows]
    newPriceMatrixRows[indexRow][key] = data
    setValue(newPriceMatrixRows, 'rows', 'priceMatrix')
  }

  addLine = () => {
    const { priceMatrix, setValue } = this.props
    const createRow = {
      price: {
        currency: 'USD',
        value: 0,
      },
      label: '',
    }
    const newPriceMatrixRows = [...priceMatrix.rows]
    newPriceMatrixRows.push(createRow)
    setValue(newPriceMatrixRows, 'rows', 'priceMatrix')
  }

  render() {
    const { priceMatrix } = this.props
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
