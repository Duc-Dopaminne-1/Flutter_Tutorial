import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import { StyleSheet, Text, View } from 'react-native'
import I18n from '@/i18n'
import { colors } from '@/vars'
// @ts-ignore
import { ActionSheet } from '@/components/ActionSheet/ActionSheetScreen'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  onPressSheetArchive?: (index: number) => void
  onPressSheetDelete?: (index: number) => void
  onPressSheetMultiDelete?: (index: number) => void
  onPressSheetEdit?: (index: number) => void
  _actionSheetDeleteRef?: any
  _actionSheetMultiDeleteRef?: any
  _actionSheetArchiveRef?: any
  _actionSheetEditRef?: any
  totalProduct: number
} & DefaultProps &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<typeof initialState> & Partial<{}>

@withContext(AppContext.Consumer)
export class ProductActionSheet extends React.PureComponent<Props, State> {
  optionsMulti = [
    I18n.t('changeCategory'),
    I18n.t('changeSupplier'),
    I18n.t('changePrice'),
    I18n.t('changeStatus'),
    I18n.t('deleteProducts'),
    // tslint:disable-next-line:jsx-key
    <Text style={styles.ActionSheetText}>{I18n.t('archiveProducts')}</Text>,
    I18n.t('cancel'),
  ]

  readonly state = initialState

  render() {
    const {
      onPressSheetArchive,
      onPressSheetDelete,
      onPressSheetMultiDelete,
      onPressSheetEdit,
      _actionSheetDeleteRef,
      _actionSheetMultiDeleteRef,
      _actionSheetArchiveRef,
      _actionSheetEditRef,
    } = this.props
    const { totalProduct } = this.props
    return (
      <View>
        <ActionSheet
          ref={_actionSheetArchiveRef}
          options={[
            I18n.t('archiveProduct', {
              total: totalProduct,
              isMany: totalProduct === 1 ? '' : 's',
            }),
            I18n.t('cancel'),
          ]}
          cancelButtonIndex={1}
          onPress={onPressSheetArchive}
        />

        <ActionSheet
          ref={_actionSheetDeleteRef}
          options={[I18n.t('deleteProduct'), I18n.t('cancel')]}
          destructiveButtonIndex={0}
          cancelButtonIndex={1}
          firstItem={1}
          lastItem={1}
          onPress={onPressSheetDelete}
        />

        <ActionSheet
          ref={_actionSheetMultiDeleteRef}
          options={[
            I18n.t('deleteProductsLength', {
              productLength: totalProduct,
              isMany: totalProduct === 1 ? '' : 's',
            }),
            I18n.t('cancel'),
          ]}
          destructiveButtonIndex={0}
          cancelButtonIndex={1}
          onPress={onPressSheetMultiDelete}
        />

        <ActionSheet
          ref={_actionSheetEditRef}
          title={I18n.t('editProducts', {
            length: totalProduct,
            isMany: totalProduct === 1 ? '' : 's',
          }).capitalize()}
          options={this.optionsMulti}
          lastItem={5}
          destructiveButtonIndex={4}
          cancelButtonIndex={6}
          onPress={onPressSheetEdit}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  ActionSheetText: {
    color: colors.gray_product,
    fontSize: 18,
  },
})
