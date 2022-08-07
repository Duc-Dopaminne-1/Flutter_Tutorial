import React, { useState, useEffect, useMemo, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { TabView, TabBar } from 'react-native-tab-view';
import InsuranceTab from './components/insurance_tab';
import { DEVICE_WIDTH } from '../../../constants/size';
import { scale } from '../../../utils/responsive';
import BodyText from '../../../components/text/body_text';
import { ICCreditTab, ICExtraServiceTab, ICInsuranceTab } from '../../../assets/icons';
import CreditTab from './components/credit_tab';
import ExtraServiceTab from './components/extra_service_tab';
import { apiGetHeaderOfProductCode } from '../../../services/api/masterDataApi';
import { EmptyContent } from '../../../components';
import { empty_info } from '../../../assets/images';
import themeContext from '../../../constants/theme/themeContext';
const SuggestProductList = props => {
  const productCode = props.route?.params?.productCode;
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = React.useState(0);

  const theme = useContext(themeContext);

  const onFetchHeaderOfProductCode = async () => {
    const rs = await apiGetHeaderOfProductCode({ productCode });
    setLoading(false);
    if (rs?.data?.success) {
      const { addedServices, finance, insurance } = rs.data.result;
      const newRoutes = [];
      if (finance) {
        newRoutes.push({
          key: 'credit_tab',
          title: 'screen_name.loan',
          icon: <ICCreditTab color1={theme?.icon?.color1} />
        });
      }
      if (insurance) {
        newRoutes.push({
          key: 'insurance_tab',
          title: 'transaction_history.insurance',
          icon: <ICInsuranceTab color1={theme?.icon?.color1} />
        });
      }
      if (addedServices) {
        newRoutes.push({
          key: 'extra_service_tab',
          title: 'transaction_history.added_service',
          icon: <ICExtraServiceTab color1={theme?.icon?.color1} />
        });
      }
      setRoutes(newRoutes);
    }
  };
  useEffect(() => {
    setLoading(true);
    onFetchHeaderOfProductCode();
  }, []);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'credit_tab':
        return <CreditTab productCode={productCode} route={props.route} />;
      case 'insurance_tab':
        return <InsuranceTab productCode={productCode} route={props.route} />;
      case 'extra_service_tab':
        return <ExtraServiceTab productCode={productCode} route={props.route} />;
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      renderLabel={({ route, focused, color }) => (
        <View
          style={[
            styles.tabContainer,
            { backgroundColor: focused ? theme.app.primaryColor1 : CUSTOM_COLOR.White }
          ]}>
          {route.icon}
          <BodyText
            translate
            numberOfLines={2}
            color={focused ? CUSTOM_COLOR.White : theme?.text?.primary}
            style={{
              ...styles.subHeadTitle
            }}>
            {route.title}
          </BodyText>
        </View>
      )}
      {...props}
      indicatorStyle={styles.tabBarIndicatorStyle}
      style={styles.tabBarStyle}
      scrollEnabled
      tabStyle={styles.tabStyle}
    />
  );
  return (
    <View style={styles.container}>
      {routes?.length > 0 && (
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: DEVICE_WIDTH }}
          lazy
        />
      )}
      {!loading && routes.length == 0 && (
        <EmptyContent
          translate
          title={'additional_service_profiles.no_products'}
          image={empty_info}
        />
      )}
    </View>
  );
};
export default SuggestProductList;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR.White, paddingTop: 10 },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: scale(164),
    height: scale(64),
    borderRadius: 10,
    shadowColor: CUSTOM_COLOR.ShuttleGray,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  tabBarStyle: {
    backgroundColor: 'white',
    shadowOffset: { height: 0, width: 0 },
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0
  },
  tabStyle: {
    width: scale(177)
  },
  tabBarIndicatorStyle: {
    height: 0
  },
  subHeadTitle: {
    fontSize: 14,
    marginLeft: scale(10),
    maxWidth: scale(100)
  }
});
