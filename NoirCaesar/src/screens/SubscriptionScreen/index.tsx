import React, { useState } from 'react';
import NavigationActionsService from '@src/navigation/navigation';
import styles from './styles';
import { View, ScrollView, SafeAreaView, FlatList, Platform } from 'react-native';
import { CustomHeader } from '@src/components/CustomHeader';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import { BACK, LOGO } from '@src/constants/icons';
import Container from '@src/components/Container';
import FastImage from 'react-native-fast-image';
import translate from '@src/localize';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { IAPService } from '@src/modules/iap/IAPService';
import { SubscriptionItem } from '@src/components/FlatListItem/SubscriptionItem';
import { ISubscription, ISubscriptionPackageProvider, ISubscriptionPackage } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';

const SubscriptionScreen = () => {
  const [subscribeIndex, setSubscribeIndex] = useState(0);
  const subscriptions = useSelector<RootState, ISubscriptionPackage[]>((state: RootState) => state.iap.subscriptions);
  const activePlan = useSelector<RootState, ISubscription>((state: RootState) => state.iap.activePlan);

  const getActivePlanIndex = () => {
    let activeIndex = -1;
    if (activePlan.subscription) {
      subscriptions.forEach((subscription: ISubscriptionPackage, index: number) => {
        if (subscription.id === activePlan.transaction.subscription_package.id) {
          activeIndex = index;
          return;
        }
      });
    }
    return activeIndex;
  };

  const handleBack = () => {
    NavigationActionsService.toggleDrawer(true);
  };

  const doStartSubscription = () => {
    const subscription = subscriptions[subscribeIndex];
    const { providers } = subscription;
    if (providers && providers.length > 0) {
      const selfProvider = providers.filter((provider: ISubscriptionPackageProvider) => {
        return provider.provider === Platform.OS;
      })[0];
      if (selfProvider && selfProvider.provider_id) {
        IAPService.getInstance().doRequestSubscription(selfProvider.provider_id);
      }
    }
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        containerStyle={styles.headerContainer}
        title={translate('subscription.title')}
        titleStyle={styles.headerTitle}
        leftImage={BACK}
        leftAction={handleBack}
      />
    );
  };

  const renderImage = () => {
    return <FastImage style={styles.logo} resizeMode="cover" source={LOGO} />;
  };

  const onPressItem = (index: number) => {
    setSubscribeIndex(index);
  };

  const renderItem = ({ index, item }: { index: number; item: ISubscriptionPackage }) => {
    const activePlanIndex = getActivePlanIndex();
    const disableButton = activePlanIndex >= 0 && activePlanIndex != index;
    const matchActivePlan = activePlanIndex == index;
    const matchSubscribeIndex = subscribeIndex == index;

    return (
      <SubscriptionItem
        disableButton={disableButton}
        item={item}
        isActive={activePlanIndex >= 0 ? matchActivePlan : matchSubscribeIndex}
        onPressItem={onPressItem.bind(undefined, index)}
      />
    );
  };

  const getSortedList = () => {
    return subscriptions.sort(function(a, b) {
      return a.amount - b.amount;
    });
  };

  const renderSubscriptionList = () => (
    <FlatList
      contentContainerStyle={styles.flatList}
      data={getSortedList()}
      numColumns={2}
      renderItem={renderItem}
      extraData={{ subscribeIndex, activePlan }}
      keyExtractor={(_, index) => index.toString()}
    />
  );

  const renderInformationText = () => {
    return <CustomText style={styles.subscriptionInfo} text={translate('subscription.content')} />;
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        {renderSubscriptionList()}
        {renderInformationText()}
      </View>
    );
  };

  const renderBottomButton = () => {
    if (subscriptions.length == 0) return null;

    const disableButton = activePlan && activePlan.subscription;
    const buttonText = disableButton ? translate('subscription.button_subscribed') : translate('subscription.button');

    return (
      <SafeAreaView>
        <CustomButton
          disabled={disableButton}
          activeOpacity={0.8}
          style={styles.startSubscribeButton}
          text={buttonText}
          onPress={doStartSubscription}
        />
      </SafeAreaView>
    );
  };

  return (
    <Container>
      {renderHeader()}
      <ScrollView style={styles.mainViewContainer}>
        {renderImage()}
        {renderContent()}
      </ScrollView>
      {renderBottomButton()}
    </Container>
  );
};

export default SubscriptionScreen;
