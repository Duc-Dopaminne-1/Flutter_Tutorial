import AppText from '../../../../components/app_text';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import CreditTab from '../refund_request_list/index';
import InsuranceTab from '../refund_request_insuarance_list/index';
import { styles } from './styles';
import themeContext from '../../../../constants/theme/themeContext';
import {
  ICCreditActive,
  ICCreditInactive,
  ICInsuranceActive,
  ICInsuranceInactive
} from '../../../../assets/icons';

function RefundRequest(props) {
  const theme = useContext(themeContext);
  const TabItem = [
    {
      name: 'product_screen.finance',
      active: <ICCreditActive color2={theme?.icon?.color1} color1={theme?.icon?.color2} />,
      inactive: <ICCreditInactive />,
      tab: () => <CreditTab route={props.route} navigation={props.navigation} />
    },
    {
      name: 'product_screen.insurrance',
      active: <ICInsuranceActive color2={theme?.icon?.color1} color1={theme?.icon?.color2} />,
      inactive: <ICInsuranceInactive />,
      tab: () => <InsuranceTab route={props.route} navigation={props.navigation} />
    }
    // {
    //   name: 'product_screen.added_service',
    //   active: ic_extra_service_a,
    //   inactive: ic_extra_service_i,
    //   tab: () => <ExtraServiceTab route={props.route} />
    // }
  ];
  const [tabIndex, setTabIndex] = useState(0);
  const [listTab, setListTab] = useState([]);

  const featureList = useSelector(state => state.toggleFeature.featureList);

  useEffect(() => {
    let tmp = [];
    if (featureList?.includes('credit')) {
      tmp.push(0);
    }
    if (featureList?.includes('insurance')) {
      tmp.push(1);
    }
    // if (featureList?.includes('extra-service')) {
    //   tmp.push(2);
    // }
    setListTab(tmp);
    if (tmp.length > 0) {
      setTabIndex(tmp[0]);
    }
  }, [featureList]);

  // useEffect(() => {
  //   navigation.setOptions({
  //     RightComponent: () => {
  //       return (
  //         <>
  //           <TouchableOpacity
  //             style={styles.updateButton}
  //             onPress={() => navigation.navigate(SCREENS_NAME.SELECT_PRODUCT_TYPE_SCREEN, {})}>
  //             <SubHead translate color={TEXT_COLOR.GreenLight} style={styles.create}>
  //               application.create
  //             </SubHead>
  //           </TouchableOpacity>
  //         </>
  //       );
  //     }
  //   });
  // }, [navigation, memberId, dispatch, featureList]);

  return (
    <SafeAreaView style={styles.container}>
      {listTab?.length > 1 ? (
        <View style={styles.groupType}>
          {TabItem.map((tab, index) =>
            listTab.includes(index) ? (
              <TouchableOpacity
                style={styles.typeContainer}
                onPress={() => setTabIndex(index)}
                key={'' + index}>
                {index === tabIndex ? tab.active : tab.inactive}
                <AppText
                  translate
                  style={
                    index === tabIndex
                      ? { ...styles.textTitleActive, color: theme?.app?.primaryColor1 }
                      : { ...styles.textTitle, color: theme?.text?.primary }
                  }>
                  {tab.name}
                </AppText>
              </TouchableOpacity>
            ) : null
          )}
        </View>
      ) : null}
      {TabItem[tabIndex].tab()}
    </SafeAreaView>
  );
}

export default RefundRequest;
