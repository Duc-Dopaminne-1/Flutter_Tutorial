import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import I18n from '@/i18n'
// @ts-ignore
import { ActionSheet } from '@/components/ActionSheet/ActionSheetScreen'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  onPressSheetDelete?: (index: number) => void
  onPressSheetMultiDelete?: (index: number) => void
  onPressSheetEdit?: (index: number) => void
  _actionSheetDeleteRef?: any
  _actionSheetMultiDeleteRef?: any
  _actionSheetArchiveRef?: any
  _actionSheetEditRef?: any
  totalSupplier: number
} & DefaultProps &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<typeof initialState> & Partial<{}>

@withContext(AppContext.Consumer)
export class SupplierActionSheet extends React.PureComponent<Props, State> {
  optionsMulti = [
    I18n.t('changeCategory'),
    I18n.t('changeTag'),
    I18n.t('changeStatus'),
    I18n.t('deleteSuppliers'),
    I18n.t('cancel'),
  ]

  readonly state = initialState

  render() {
    const {
      onPressSheetDelete,
      onPressSheetMultiDelete,
      onPressSheetEdit,
      _actionSheetDeleteRef,
      _actionSheetMultiDeleteRef,
      _actionSheetEditRef,
    } = this.props
    const { totalSupplier } = this.props

    return (
      <>
        <ActionSheet
          ref={_actionSheetDeleteRef}
          options={[I18n.t('deleteSupplier'), I18n.t('cancel')]}
          destructiveButtonIndex={0}
          cancelButtonIndex={1}
          firstItem={1}
          lastItem={1}
          onPress={onPressSheetDelete}
        />

        <ActionSheet
          ref={_actionSheetMultiDeleteRef}
          options={[
            I18n.t('deleteSuppliersLength', {
              supplierLength: totalSupplier,
              isMany: totalSupplier === 1 ? '' : 's',
            }),
            I18n.t('cancel'),
          ]}
          destructiveButtonIndex={0}
          cancelButtonIndex={1}
          onPress={onPressSheetMultiDelete}
        />

        <ActionSheet
          ref={_actionSheetEditRef}
          title={I18n.t('editSuppliers', {
            length: totalSupplier,
            isMany: totalSupplier === 1 ? '' : 's',
          }).capitalize()}
          options={this.optionsMulti}
          lastItem={3}
          destructiveButtonIndex={3}
          cancelButtonIndex={4}
          onPress={onPressSheetEdit}
        />
      </>
    )
  }
}
