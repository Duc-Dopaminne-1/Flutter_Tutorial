import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { Category, Supplier, Tag } from '@/models/team'
import { SupplierInfoContext } from '@/screens/SupplierInfo/SupplierInfoContext'
import { withContext } from '@/shared/withContext'
import { metrics } from '@/vars'
import { colors } from '@/vars/colors'
import * as React from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { SupplierInfoDetailInfo } from './SupplierInfoDetailInfo'
import { ADataRow } from '@/components/ADataRow/ADataRow'
import {
  SupplierData,
  supplierNavigation,
  SupplierRef,
} from '@/navigation/supplierNavigation'
import I18n from '@/i18n'
import { ADataRowEmpty } from '@/components/ADataRow/ADataRowEmpty'
import { ADataText } from '@/components/ADataText/ADataText'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'

type Props = Partial<{
  tabLabel: string
  supplier?: Supplier
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  descriptionKey: number
}>

@DelayRender({ delay: 100 })
@withContext(AppContext.Consumer)
@withContext(SupplierInfoContext.Consumer)
export class SupplierInfoDetail extends React.PureComponent<Props, State> {
  readonly state: State = {
    descriptionKey: 0,
  }

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    supplierNavigation.setData(
      SupplierData.DescriptionOnSave,
      this.onSaveDescription
    )
  }

  onPressTagHeader = () => {
    supplierNavigation.open(SupplierRef.SelectTags)
  }

  onPressProductCatHeader = () => {
    supplierNavigation.open(SupplierRef.SelectMultiCategory)
  }

  renderProductCatEmpty = () => {
    return (
      <ADataRowEmpty
        title={I18n.t('productCategory')}
        description={I18n.t('noCategoriesYet')}
        onPress={this.onPressProductCatHeader}
        containerStyle={{ paddingTop: 24 }}
      />
    )
  }

  openTextEditor = () => {
    supplierNavigation.open(SupplierRef.Description)
  }

  onSaveDescription = (description: string, isMoveDown: boolean = false) => {
    const { supplierFactory, supplier } = this.props

    supplierFactory
      .update(supplier.id, {
        description,
      })
      .subscribe(() => {
        Keyboard.dismiss()
        !isMoveDown && supplierNavigation.close(SupplierRef.Description)
        this.updateDescriptionKey()
      })
  }

  updateDescriptionKey = () => {
    this.setState((prevState: State) => {
      return {
        descriptionKey: prevState.descriptionKey + 1,
      }
    })
  }

  render() {
    const { supplier } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <ADataText
            onOpen={this.openTextEditor}
            description={supplier && supplier.description}
            descriptionKey={this.state.descriptionKey}
          />

          <ADataRow<Category>
            data={supplier.categories}
            label={I18n.t('productCategory')}
            onPressHeader={this.onPressProductCatHeader}
            ListEmptyComponent={this.renderProductCatEmpty}
          />

          <ADataRow<Tag>
            data={supplier.tags}
            onPressHeader={this.onPressTagHeader}
          />

          <SupplierInfoDetailInfo />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light_white_gray,
  },
  wrapper: {
    backgroundColor: colors.white,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
  },
})
