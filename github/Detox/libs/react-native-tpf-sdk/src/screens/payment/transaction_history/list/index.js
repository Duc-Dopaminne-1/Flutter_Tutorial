import { ic_discount_a, ic_payment_a } from '../../../../assets/images';
import {
  ICPaymentActive,
  ICPaymentInactive,
  ICDiscountActive,
  ICDiscountInactive
} from '../../../../assets/icons';
import AppText from '../../../../components/app_text';
import { DEVICE_WIDTH } from '../../../../constants/size';
import React, { useState, useContext } from 'react';
import { useCallback, useEffect } from 'react';
import { useRef } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import InvoiceTab from '../invoice/invoice_tab';
import TransactionTab from '../invoice/transaction_tab';
import { styles } from './styles';
import themeContext from '../../../../constants/theme/themeContext';

function TransactionList(props) {
  const theme = useContext(themeContext);
  const { mainTab, transactionTab } = props?.route?.params || {};
  const TabItem = [
    {
      name: 'transaction_history.pay',
      active: () => <ICPaymentActive color2={theme.icon.color1} color1={theme.icon.color2} />,
      inactive: () => <ICPaymentInactive />,
      tab: () => <InvoiceTab />
    },
    {
      name: 'transaction_history.discount',
      active: () => <ICDiscountActive color2={theme.icon.color1} color1={theme.icon.color2} />,
      inactive: () => <ICDiscountInactive />,
      tab: () => <TransactionTab navigation={props?.navigation} transactionTab={transactionTab} />
    }
  ];
  const [tabIndex, setTabIndex] = useState(mainTab || 0);
  const scrollRef = useRef();

  const onChangeTab = useCallback(index => {
    if (index === 0) {
      scrollRef.current.scrollTo({ x: 0, animated: false });
    } else {
      scrollRef.current.scrollTo({ x: DEVICE_WIDTH, animated: false });
    }
    setTabIndex(index);
  }, []);

  useEffect(() => {
    if (mainTab && mainTab !== 0) {
      setTimeout(() => {
        scrollRef.current.scrollTo({ x: DEVICE_WIDTH, animated: false });
      }, 500);
    }
  }, [mainTab]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.groupType}>
        {TabItem.map((tab, index) => (
          <TouchableOpacity
            key={index + ''}
            style={styles.typeContainer}
            onPress={() => onChangeTab(index)}>
            {/* <FastImage
              source={index === tabIndex ? tab.active : tab.inactive}
              style={styles.icon}
            /> */}
            {index === tabIndex ? tab.active() : tab.inactive()}
            <AppText
              translate
              style={
                index === tabIndex
                  ? { ...styles.textTitleActive, color: theme?.app?.primaryColor1 }
                  : styles.textTitle
              }>
              {tab.name}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
      {/* {TabItem[tabIndex].tab()} */}
      <ScrollView ref={scrollRef} pagingEnabled horizontal scrollEnabled={false}>
        {TabItem.map(tab => tab.tab())}
      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(TransactionList);
