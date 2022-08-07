import * as React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { colors, fonts, images } from '@/vars'
import I18n from '@/i18n'
import { SupplierEmptyCard } from '@/screens/Supplier/Components/SupplierEmptyCard'
import { CameraMode } from '@/common/constants/CameraMode'
import { navigation } from '@/navigation/navigation'
import {
  createSupplierNavigation,
  CreateSupplierRef,
} from '@/navigation/createSupplierNavigation'
import { supplierStore, SupplierStoreRef } from '@/stores/supplierStore'
import { eventStore } from '@/stores/eventStore'
import { Subscription } from 'rxjs'

type Props = Readonly<{}>

export class SupplierEmpty extends React.PureComponent<Props> {
  _subscribeEvent: Subscription

  state = {
    enableButtonTwo: !!eventStore.currentEvent,
  }

  componentDidMount() {
    this._subscribeEvent = eventStore.updateEventSub.subscribe(data => {
      this.setState({
        enableButtonTwo: !!data,
      })
    })
  }

  componentWillUnmount() {
    this._subscribeEvent && this._subscribeEvent.unsubscribe()
  }

  onPressBrowseShows = () => {
    navigation.navigate('EventScreen', {})
  }

  onPressExhibitors = () => {
    if (eventStore.currentEvent) {
      supplierStore.changeTabView(SupplierStoreRef.TabView, 0)
    }
  }

  onPressBusinessCard = () => {
    navigation.navigate('CameraScreen', {
      cameraMode: CameraMode.BusinessCard,
      maxFiles: 1,
    })
  }

  onPressCreateSupplier = () => {
    createSupplierNavigation.open(CreateSupplierRef.Create)
  }

  render() {
    const { enableButtonTwo } = this.state

    return (
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <Image
          source={images.supplierPlace}
          style={styles.icon}
          resizeMode="contain"
        />
        <View style={styles.wrapDoNotSupplier}>
          <Text style={styles.textNoSupplier}>{I18n.t('doNotSupplier')}</Text>
        </View>
        <View style={styles.wrapTextCreateSupplier}>
          <Text style={styles.textCreateSupplier}>
            {I18n.t('createYourSupplier')}
          </Text>
        </View>
        <View style={styles.wrapTextFindSupplier}>
          <Text style={styles.textFindSupplier}>{I18n.t('findSuppliers')}</Text>
        </View>

        <SupplierEmptyCard
          icon={images.event}
          title={I18n.t('tradeShows')}
          content={I18n.t('messageTradeShows')}
          textButtonOne={I18n.t('browseShows')}
          textButtonTwo={I18n.t('seeExhibitors')}
          onPressButtonOne={this.onPressBrowseShows}
          onPressButtonTwo={this.onPressExhibitors}
          disableButtonTwo={!enableButtonTwo}
          isTwoButton={true}
        />
        <SupplierEmptyCard
          title={I18n.t('scanBusiness')}
          icon={images.businessCard}
          content={I18n.t('scanningBusiness')}
          textButtonOne={I18n.t('scanCard')}
          onPressButtonOne={this.onPressBusinessCard}
        />
        <SupplierEmptyCard
          styleContainer={styles.itemContainer}
          title={I18n.t('manualEntry')}
          icon={images.textEdit}
          content={I18n.t('manualEntryContent')}
          textButtonOne={I18n.t('createSupplier')}
          onPressButtonOne={this.onPressCreateSupplier}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  icon: {
    height: 84,
    width: 84,
    marginTop: 32,
  },
  wrapTextCreateSupplier: {
    paddingHorizontal: 10,
  },
  wrapTextFindSupplier: {
    marginBottom: 30,
  },
  wrapDoNotSupplier: {
    marginTop: 24,
    marginBottom: 3,
  },
  textNoSupplier: {
    fontSize: fonts.size.xxl,
    color: colors.dark_blue_grey,
    fontWeight: '600',
    fontFamily: fonts.family.SSPSemiBold,
  },
  textCreateSupplier: {
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPRegular,
    marginBottom: 40,
    textAlign: 'center',
  },
  textFindSupplier: {
    fontSize: fonts.size.xxl,
    color: colors.dark_blue_grey,
    fontWeight: '600',
    fontFamily: fonts.family.SSPSemiBold,
  },
  itemContainer: {
    marginBottom: 113,
  },
})
