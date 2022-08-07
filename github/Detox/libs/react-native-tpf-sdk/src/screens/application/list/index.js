import React, { useContext, useEffect, useState, useMemo } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  ICCreditActive,
  ICCreditInactive,
  ICExtraServiceActive,
  ICExtraServiceInactive,
  ICInsuranceActive,
  ICInsuranceInactive,
  ICRequestActive,
  ICRequestInactive,
  ICRequestSupportActive,
  ICRequestSupportInactive
} from '../../../assets/icons';
import AppText from '../../../components/app_text';
import { DEVICE_WIDTH } from '../../../constants/size';
import themeContext from '../../../constants/theme/themeContext';
import LeadList from '../../lead/list';
import Support from '../../support/support_list';
import CreditTab from '../credit/credit_tab';
import ExtraServiceTab from '../extra_service/extra_service_tab';
import InsuranceTab from '../insurance/insurance_tab';
import { styles } from './styles';
import { MEMBER_TYPE } from '../../../global/member_type';
import { useNavigation } from '@react-navigation/native';
import SCREENS_NAME from '../../../constants/screens';

function ApplicationList(props) {
  const theme = useContext(themeContext);
  const scrollRef = React.useRef();
  const featureList = useSelector(state => state.toggleFeature.featureList);
  const role = useSelector(state => state.auth.role);
  const params = props.route?.params || {};
  const [tabIndex, setTabIndex] = useState(null);
  const navigation = useNavigation();
  const TabItem = useMemo(() => {
    const listFeature = [
      {
        code: 'extra_service',
        name: 'product_screen.add_more_service',
        active: () => (
            <ICExtraServiceActive color2={theme.icon.color1} color1={theme.icon.color2} />
        ),
        inactive: () => <ICExtraServiceInactive />,
        tab: () => <ExtraServiceTab route={props.route} />
      },
      {
        code: 'request',
        name: 'product_screen.request',
        active: () => <ICRequestActive color2={theme.icon.color1} color1={theme.icon.color2} />,
        inactive: () => <ICRequestInactive />,
        tab: () => <LeadList disableShadow={false} route={props.route} />
      },
      {
        code: 'request_support',
        name: 'product_screen.request_support',
        active: () => (
            <ICRequestSupportActive color2={theme.icon.color1} color1={theme.icon.color2} />
        ),
        inactive: () => <ICRequestSupportInactive />,
        tab: () => <Support disableShadow={false} route={props.route} />
      }
    ];
    let listTab =
      role === MEMBER_TYPE.Topener
        ? listFeature
        : listFeature.filter(item => item.code != 'request');
    if (featureList?.includes('insurance')) {
      listTab = [
        {
          code: 'insurance',
          name: 'product_screen.insurrance',
          active: () => <ICInsuranceActive color2={theme.icon.color1} color1={theme.icon.color2} />,
          inactive: () => <ICInsuranceInactive />,
          tab: () => <InsuranceTab route={props.route} />
        }
      ].concat(listTab);
    }
    if (featureList?.includes('credit')) {
      listTab = [
        {
          code: 'credit',
          name: 'product_screen.finance',
          active: () => <ICCreditActive color2={theme.icon.color1} color1={theme.icon.color2} />,
          inactive: () => <ICCreditInactive />,
          tab: () => <CreditTab route={props.route} />
        }
      ].concat(listTab);
    }
    return listTab;
  }, [featureList]);

  React.useLayoutEffect(() => {
    if (params.tab && TabItem?.length > 0) {
      const indexTab = TabItem.findIndex(elem => elem.code === params?.tab);
      setTabIndex(indexTab > -1 ? indexTab : 0);
    } else if (TabItem?.length > 0) {
      setTabIndex(0);
    }
  }, [featureList, TabItem]);

  useEffect(() => {
    if (tabIndex === 4) {
      setTimeout(() => {
        scrollRef?.current?.scrollTo({ x: DEVICE_WIDTH, animated: true });
      }, 500);
    } else if (tabIndex === 0) {
      setTimeout(() => {
        scrollRef?.current?.scrollTo({ x: 0, animated: true });
      }, 500);
    }
  }, [tabIndex]);

  useEffect(() => {
    navigation.setOptions({
      backAction: () => {
        navigation.navigate(SCREENS_NAME.MIDDLEWARE);
      }
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef}>
          <View style={styles.groupType}>
            {TabItem.map((tab, index) => (
              <TouchableOpacity
                style={styles.typeContainer}
                onPress={() => setTabIndex(index)}
                key={'' + index}>
                {/* <FastImage
                      source={index === tabIndex ? tab.active : tab.inactive}
                      style={styles.icon}
                    /> */}
                {index === tabIndex ? tab.active() : tab.inactive()}
                <AppText
                  translate
                  style={[
                    styles.textTitle,
                    { color: index === tabIndex ? theme.app.primaryColor1 : theme.text.primary }
                  ]}>
                  {tab.name}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      {TabItem?.[tabIndex] ? TabItem[tabIndex].tab() : null}
    </SafeAreaView>
  );
}

export default ApplicationList;
