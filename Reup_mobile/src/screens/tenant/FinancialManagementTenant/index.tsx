import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Image, TouchableOpacity, Alert, RefreshControl } from "react-native";
import CustomInfoList from "@src/components/CustomInfoList";
import styles from './styles';
import Container from '@src/components/Container';
import translate from '@src/localize';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import CREDIT_CARD_ICON from '@res/icons/ic_creditcard.png';
import CustomSectionHeader from '@src/components/CustomSection';
import { CustomButton } from '@src/components/CustomButton';
import { ADD_PLUS, PAYPAL, MASTER_CARD, CREDIT_CARD } from '@src/constants/icons';
import { CustomFlatList } from '@src/components/FlatList';
import { upperCase } from 'lodash';
import { CustomText } from '@src/components/CustomText';
import { colors } from '@src/constants/vars';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { NEW_BANK_ACCOUNT_TENANT } from '@src/constants/screenKeys';
import NavigationActionsService from '@src/navigation/navigation';
import IMG_EMPTY from '@src/res/img/empty.png';
import { IFinancialResponse } from '@reup/reup-api-sdk/libs/api/financial/models';
import { deleteBankAccount, getBankAccount } from '@src/modules/financial/action';
import { FinancialCardType } from '@reup/reup-api-sdk/libs/api/enum';

const FinancialManagementTenant = () => {
  const dispatch = useDispatch();
  const listRef = useRef<any>(null);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultProperty = me && me.default_property ? me.default_property : '';
  const bankAccount = useSelector<RootState, IFinancialResponse>((state: RootState) => state.financial.bankAccount);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchBankAccount(defaultProperty);
  }, [defaultProperty]);

  const fetchBankAccount = (propertyId: string) => {
    if (!propertyId) {
      return;
    }
    NavigationActionsService.showLoading();
    dispatch(
      getBankAccount({
        propertyId,
        onFail: error => {
          setIsRefreshing(false);
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
        onSuccess: data => {
          setIsRefreshing(false);
          NavigationActionsService.hideLoading();
        }
      })
    );
  };

  const getCardHeader = () => {
    if (!bankAccount.id) {
      return [];
    }
    switch (bankAccount.card_type) {
      case FinancialCardType.Credit:
        return [{
          id: FinancialCardType.Credit,
          image: CREDIT_CARD,
          name: translate('financial_management.credit_card'),
        }];
      case FinancialCardType.Master:
        return [{
          id: FinancialCardType.Master,
          image: MASTER_CARD,
          name: translate('financial_management.master_card'),
        }];
      case FinancialCardType.Paypal:
      default:
        return [{
          id: FinancialCardType.Paypal,
          image: PAYPAL,
          name: translate('financial_management.paypal'),
        }];
    }
  };

  const deleteCard = () => {
    if (!defaultProperty) {
      return;
    }
    NavigationActionsService.showLoading();
    dispatch(
      deleteBankAccount({
        propertyId: defaultProperty,
        onSuccess: data => {
          fetchBankAccount(defaultProperty);
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  // BANK ACCOUNT INFO
  const listCardHeader = getCardHeader();

  // CREDIT CARD DATA
  const cardOwner = {
    left: translate('financial_management.name_on_card'),
    right: bankAccount && bankAccount.name_on_card ? bankAccount.name_on_card : ''
  };

  const cardNo = {
    left: translate('financial_management.card_number'),
    right: bankAccount && bankAccount.card_number ? bankAccount.card_number : ''
  };

  const bankName = {
    left: translate('financial_management.bank_name'),
    right: bankAccount && bankAccount.bank_name ? bankAccount.bank_name : ''
  };

  const country = {
    left: translate('financial_management.country'),
    right: bankAccount && bankAccount.country ? bankAccount.country.name : ''
  };

  const city = {
    left: translate('financial_management.city'),
    right: bankAccount && bankAccount.city ? bankAccount.city.name : ''
  };

  const expiredDate = {
    left: translate('financial_management.expired_date'),
    right: bankAccount && bankAccount.expire_day ? bankAccount.expire_day : ''
  };

  const creditCardList: any[] = [cardOwner, cardNo, bankName, country, city, expiredDate];

  const onAddBankAccount = () => {
    NavigationActionsService.push(NEW_BANK_ACCOUNT_TENANT);
  };

  const onDeleteBankAccount = () => {
    Alert.alert(translate('alert.title_confirm'), translate('financial_management.alert_delete'),
      [{
        style: 'default',
        text: translate('financial_management.ok'),
        onPress: () => deleteCard()
      },
      {
        style: 'cancel',
        text: translate('financial_management.cancel'),
        onPress: () => { }
      }]
    );
  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {

  };

  const onBankItemPress = (index: number) => {
    setCurrentIndex(index);
  };

  const renderSectionHeader = () => {
    return (
      <CustomSectionHeader
        title={translate('financial_management.title_section_bank')}
        icon={CREDIT_CARD_ICON}
        style={styles.sectionHeader}
        styleIcon={styles.iconSectionHeader}
      />
    );
  };

  const renderEmptyView = () => {
    return (
      <View style={styles.containerEmpty}>
        <Image source={IMG_EMPTY} resizeMode='contain' style={styles.viewEmpty} />
        <CustomText text={translate('empty_in_here')} style={styles.textEmpty} />
      </View>
    );
  };


  const renderCreditCardList = (index: number) => {
    const title = upperCase(listCardHeader[index].name);
    return (
      <View style={styles.viewBankInfo}>
        <CustomInfoList
          titleText={title}
          listData={creditCardList}
          titleImage={CREDIT_CARD_ICON}
        />
      </View>
    );
  };

  const renderItem = (item: any, index: number) => {
    return (
      <TouchableOpacity onPress={() => onBankItemPress(index)}>
        <View style={styles.viewItem}>
          <Image resizeMode={'contain'} source={item.image} style={styles.iconArrowStyles}></Image>
          <CustomText style={styles.textNameBank} text={item.name} />
          <View style={[styles.viewUnderline, { backgroundColor: currentIndex === index ? colors.PRIMARY : colors.WHITE }]}></View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBankAccountInfo = () => {
    return (
      <CustomFlatList
        ref={listRef}
        onLoad={onLoad}
        horizontal={true}
        style={styles.listContainer}
        contentContainerStyle={styles.contentContainerFlatlist}
        data={listCardHeader}
        renderItem={(item: any, index: number) => renderItem(item, index)}
      />
    );
  };

  const renderAddBtn = () => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onAddBankAccount}
          iconLeft={ADD_PLUS}
          text={translate('financial_management.submit_button')}
          style={styles.button} />
      </View>
    );
  };

  const renderDeleteBtn = () => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onDeleteBankAccount}
          text={translate('financial_management.delete_button')}
          style={styles.buttonDelete} />
      </View>
    );
  };
  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      fetchBankAccount(defaultProperty);
    }, 700);
  };
  const renderRefreshControl = () => {
    if (!bankAccount.id) {
      return (< RefreshControl
        tintColor={colors.GRAY500}
        refreshing={isRefreshing}
        onRefresh={onRefresh} />);
    }
    return undefined;
  };

  const renderMainView = () => {
    return (
      <Container
        spaceBottom={true}
        isShowHeader={true}
        title={translate('financial_management.title')}
      >
        <View style={[styles.container]}>
          {renderSectionHeader()}
          <ScrollView
            refreshControl={renderRefreshControl()}
            style={styles.containerScrollView}
            contentContainerStyle={[styles.contentContainerScrollView, { flexGrow: !bankAccount.id ? 1 : 0 }]}
          >
            {!bankAccount.id
              ? renderEmptyView()
              : <>
                {renderBankAccountInfo()}
                {renderCreditCardList(currentIndex)}
              </>
            }
          </ScrollView>
          {!bankAccount.id ? renderAddBtn() : renderDeleteBtn()}
        </View>
      </Container >
    );
  };

  return (
    <View style={styles.container}>
      {renderMainView()}
    </View>
  );
};

export default React.memo(FinancialManagementTenant);
