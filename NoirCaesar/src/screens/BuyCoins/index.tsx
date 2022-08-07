import React from 'react';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import { BACK } from '@src/constants/icons';
import styles from './styles';
import { FlatList, Platform } from 'react-native';
import BuyCoinsItem from '@src/components/FlatListItem/BuyCoinsItem';
import translate from '@src/localize';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { ICoinsPackage, ICoinsPackageProvider } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { IAPService } from '@src/modules/iap/IAPService';
import Container from '@src/components/Container';
import EmptyData from '@src/components/EmptyData';

const BuyCoins = () => {
  const products = useSelector<RootState, ICoinsPackage[]>((state: RootState) => state.iap.products);

  const handleBack = () => {
    NavigationActionsService.toggleDrawer(true);
  };

  const handleCoinItemClick = (item: ICoinsPackage) => {
    const { providers } = item;
    if (providers && providers.length > 0) {
      const selfProvider = providers.filter((provider: ICoinsPackageProvider) => {
        return provider.provider === Platform.OS;
      })[0];
      if (selfProvider && selfProvider.provider_id) {
        IAPService.getInstance().doRequestPurchase(selfProvider.provider_id, item.id);
      }
    }
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        containerStyle={styles.customHeader}
        leftImage={BACK}
        leftImageStyle={styles.backButton}
        leftAction={handleBack}
        title={translate('buy_coins.title')}
      />
    );
  };

  const renderCoinItem = ({ item, index }: { item: ICoinsPackage; index: number }) => {
    return (
      <BuyCoinsItem
        title={item.title}
        price={item.amount}
        original={item.total_coins}
        bonus={item.bonus_coins}
        currency={item.currency}
        onItemClick={handleCoinItemClick.bind(undefined, item)}
      />
    );
  };

  const getSortedList = () => {
    return products.sort(function(a, b) {
      return a.amount - b.amount;
    });
  };

  const renderListCoins = () => {
    return (
      <FlatList
        style={{ flex: 1, padding: 20 }}
        keyExtractor={index => index.toString()}
        data={getSortedList()}
        renderItem={renderCoinItem}
        ListEmptyComponent={<EmptyData />}
      />
    );
  };

  return (
    <Container>
      {renderHeader()}
      {renderListCoins()}
    </Container>
  );
};

export default BuyCoins;
