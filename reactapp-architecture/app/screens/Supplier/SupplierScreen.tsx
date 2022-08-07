import I18n from '@/i18n'
import {
  createSupplierNavigation,
  CreateSupplierRef,
} from '@/navigation/createSupplierNavigation'
import { SupplierQuery } from '@/screens/Supplier/Components/SupplierQuery'
import { Factory } from '@/services/factory'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { AEmpty } from '@/components/AEmpty/AEmpty'
import { isIpad } from '@/shared/devices'
import { colors } from '@/vars'
import { Supplier } from '@/models/team'
import { SupplierInfoScreen } from '@/screens/SupplierInfo/SupplierInfoScreen'
import { supplierStore, SupplierStoreRef } from '@/stores/supplierStore'
import { Subscription } from 'rxjs'
import { changeTabSupplierList, SearchKeywordType } from '@/services/global'
import { SupplierQueryGlobal } from '@/screens/Supplier/Components/SupplierQueryGlobal'
import { eventStore } from '@/stores/eventStore'
import { AScrollableTabViewSupplier } from '@/components/AScrollableTabView/AScrollableTabViewSupplier'
import { globalSupplierStore } from '@/stores/globalSupplierStore'

type Props = Partial<{}> &
  Partial<
    NavigationInjectedProps<{
      tabRender: 'Exhibitors' | 'MySupplier' | 'AllSupplier'
    }>
  >

export type State = Readonly<{
  indexTab: number
  layoutWidth: number
  selectedItem: Supplier
  selectedIndex: number
  haveEvent: boolean
}>

export class SupplierScreen extends React.PureComponent<Props, State> {
  _selectItemSubSubscription: Subscription
  _selectGlobalItemSubSubscription: Subscription
  _navigateExhibitorsSubscription: Subscription
  _eventSubscription: Subscription
  _isSelectMulti = false

  readonly state: State = {
    indexTab: 0,
    layoutWidth: 0,
    selectedItem: null,
    selectedIndex: 0,
    haveEvent: false,
  }

  componentDidMount() {
    this.subscriptionSupplierStore()
    this.checkEvent()
    this.subscriptionNavigateExhibitors()
  }

  componentWillUnmount() {
    this._selectItemSubSubscription &&
      this._selectItemSubSubscription.unsubscribe()
    this._eventSubscription && this._eventSubscription.unsubscribe()
    this._selectGlobalItemSubSubscription &&
      this._selectGlobalItemSubSubscription.unsubscribe()
    this._navigateExhibitorsSubscription &&
      this._navigateExhibitorsSubscription.unsubscribe()
  }

  subscriptionSupplierStore = () => {
    this._selectItemSubSubscription = supplierStore
      .select()
      .subscribe(value => {
        if (value.item && value.index >= 0) {
          this.setState({
            selectedItem: value.item,
            selectedIndex: value.index,
          })

          supplierStore.update().next({
            selectedId: value.item.id,
          })
        } else {
          this.setState({
            selectedItem: null,
            selectedIndex: -1,
          })
        }
      })

    this._selectGlobalItemSubSubscription = globalSupplierStore
      .select()
      .subscribe(value => {
        if (value.item && value.index >= 0) {
          this.setState({
            selectedItem: value.item,
            selectedIndex: value.index,
          })

          globalSupplierStore.update().next({
            selectedId: value.item.globalDatabaseId,
          })
        } else {
          this.setState({
            selectedItem: null,
            selectedIndex: -1,
          })
        }
      })
  }

  subscriptionNavigateExhibitors = () => {
    this._navigateExhibitorsSubscription = changeTabSupplierList.subscribe(
      selectTab => {
        supplierStore.changeTabView(SupplierStoreRef.TabView, selectTab)
      }
    )
  }

  checkEvent = () => {
    this.setState({
      haveEvent: !!eventStore.currentEvent,
    })

    this._eventSubscription = eventStore.updateEventSub.subscribe(data => {
      this.setState({
        haveEvent: !!data,
      })
    })
  }

  onPressCreate = () => {
    if (this._isSelectMulti) {
      return
    }

    createSupplierNavigation.open(CreateSupplierRef.Create)
  }

  onLayout = event => {
    const { width } = event.nativeEvent.layout
    this.setState({
      layoutWidth: width,
    })
  }

  onSelected = (data: boolean) => {
    this._isSelectMulti = data
  }

  renderDetail = () => {
    const { selectedItem, layoutWidth, selectedIndex } = this.state

    const supplierId = selectedItem && selectedItem.id

    if (!supplierId) {
      return <AEmpty />
    }

    return (
      <View style={styles.detail} onLayout={this.onLayout}>
        {supplierId && (
          <SupplierInfoScreen
            key={supplierId}
            // @ts-ignore
            navigation={this.props.navigation}
            layoutWidth={layoutWidth}
            supplierId={supplierId}
            selectedIndex={selectedIndex}
            asComponent={isIpad()}
          />
        )}
      </View>
    )
  }

  render() {
    const { haveEvent } = this.state

    return (
      <View style={styles.container}>
        <AScrollableTabViewSupplier
          onPressCreate={this.onPressCreate}
          placeholderSearch={I18n.t('searchSupplier')}
          focusPlaceholderSearch={I18n.t('searchText')}
        >
          {haveEvent && (
            <SupplierQueryGlobal
              tabLabel={I18n.t('allExhibitors')}
              type={SearchKeywordType.Exhibitors}
            />
          )}
          <SupplierQuery
            onSelected={this.onSelected}
            tabLabel={I18n.t('mySuppliers')}
            query={`createdBy.id = "${Factory.user().identity}"`}
            type={SearchKeywordType.MySupplier}
          />
          <SupplierQuery
            onSelected={this.onSelected}
            tabLabel={I18n.t('allSuppliers')}
            type={SearchKeywordType.AllSupplier}
          />
        </AScrollableTabViewSupplier>

        {isIpad() && this.renderDetail()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
  detail: {
    flex: 1.2,
    borderLeftWidth: 1,
    borderLeftColor: colors.border_header,
  },
})
