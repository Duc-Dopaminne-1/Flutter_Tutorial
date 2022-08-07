import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../constants/colors';
import { scale } from '../../utils/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTriggerHandle, getFlowByTriggerCodeHandle } from '../../redux/actions/masterData';
import { DEVICE_WIDTH } from '../../constants/size';
import TriggerCreditProductList from '../credit/triggers/list';
import TriggerInsuranceProductList from '../insurance/triggers/list';
import TriggerExServiceProductList from '../extra_service/triggers/list';
import TriggerInsuranceCategoryList from '../insurance/triggers/category';
import TriggerCreditCategoryList from '../credit/triggers/category';
import TriggerExServiceCategoryList from '../extra_service/triggers/category';

import CreditFilterScreen from '../credit/filter';
import InsuranceListScreen from '../insurance/insurance_list';
import ExtraServiceList from '../extra_service/list';
import { useNavigation } from '@react-navigation/core';
import ExtraServiceDetail from '../extra_service/detail';
import InsuranceDetailScreen from '../insurance/insurance_detail';
import CreditProductDetail from '../credit/detail';
import themeContext from '../../constants/theme/themeContext';
import TriggerTabHeader from './components/triggerTabHeader';
import { AppLoading, EmptyContent, WithLoading } from '../../components';
import { empty_info } from '../../assets/images';
import { MASTER_DATA } from '../../redux/actionsType';
const TRIGGER_MAPPING_TYPE = {
  PROCESS: 1,
  CATEGORY: 2,
  PRODUCT: 3,
  PRODUCT_LIST: 4
};

const PRODUCT_TYPE = {
  FINANCE: 1,
  INSURANCE: 2,
  EXTRA_SERVICE: 3
};

const TriggerFlow = props => {
  const triggerCode = props.route?.params?.triggerCode;
  const fromCreateLead = props.route?.params?.fromCreateLead
  const [routes, setRoutes] = useState([]);
  const [scenes, setScenes] = useState({});
  const [index, setIndex] = React.useState(-1);
  const [categoryFlow, setCategoryFlow] = useState({});
  const [isLoading, setLoading] = useState(true);

  // const [screenRender, setScreenRender] = useState(null);
  const triggers = useSelector(state => state.masterData.triggers);
  const triggerTarget = useSelector(state => state.masterData.trigger);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useContext(themeContext);

  useEffect(() => {
    dispatch(getAllTriggerHandle({ triggerType: 1 }));
  }, []);
  useEffect(() => {
    if (triggerCode) {
      dispatch(
        getFlowByTriggerCodeHandle({
          triggerCode,
          callback: data => {
            setLoading(false);
            data?.categoryFlow && setCategoryFlow(data.categoryFlow); // in the case: extra service detail
          }
        })
      );
    }
  }, []);
  const onChangeTab = index => {
    setIndex(index);
    setLoading(true);
    const triggerCode = triggers[index || 0].triggerCode;
    dispatch(
      getFlowByTriggerCodeHandle({
        triggerCode,
        callback: data => {
          setLoading(false);
          data?.categoryFlow && setCategoryFlow(data.categoryFlow); // in the case: extra service detail
        }
      })
    );
  };
  const changeTabByTriggerCode = triggerCode => {
    let index = triggers.findIndex(t => t.triggerCode === triggerCode);
    if (index === -1) {
      setIndex(0);
    } else {
      setIndex(index);
    }
  };
  useEffect(() => {
    // Build tab
    const newRoutes = [];
    triggers.forEach(trigger => {
      let icon = trigger.triggerIcon ? JSON.parse(trigger.triggerIcon) : null;
      newRoutes.push({ key: trigger.triggerCode, title: trigger.triggerName, icon: icon });
    });
    setRoutes(newRoutes);
    let index = triggers.findIndex(t => t.triggerCode === triggerCode);
    if (index === -1) {
      setIndex(0);
    } else {
      setIndex(index);
    }
  }, [triggers]);

  useEffect(() => {
    if (triggerTarget === null) {
      return;
    }
    navigation.setOptions({
      headerTitle: triggerTarget?.triggerName
    });

    // Show with trigger target
    switch (triggerTarget?.triggerMappingType) {
      // Process
      case TRIGGER_MAPPING_TYPE.PROCESS: {
        showScreenProcess();
        break;
      }

      // Product List
      case TRIGGER_MAPPING_TYPE.PRODUCT_LIST:
        showScreenProductList();
        break;

      // Product detail
      case TRIGGER_MAPPING_TYPE.PRODUCT:
        showScreenProduct();
        break;

      // Category list
      case TRIGGER_MAPPING_TYPE.CATEGORY:
        showScreenCategory();
        break;
    }
  }, [triggerTarget]);

  const showScreenProductList = () => {
    switch (triggerTarget?.productType) {
      // Finance
      case PRODUCT_TYPE.FINANCE:
        let sceneMapTriggerProductListFinance = {};
        sceneMapTriggerProductListFinance[triggerTarget?.triggerCode] = (
          <TriggerCreditProductList />
        );
        setScenes({ ...sceneMapTriggerProductListFinance });
        break;

      case PRODUCT_TYPE.INSURANCE:
        let sceneMapTriggerProductListInsurance = {};
        sceneMapTriggerProductListInsurance[triggerTarget?.triggerCode] = (
          <TriggerInsuranceProductList />
        );
        setScenes({ ...sceneMapTriggerProductListInsurance });
        break;

      case PRODUCT_TYPE.EXTRA_SERVICE:
        let sceneMapTriggerProductListExService = {};
        sceneMapTriggerProductListExService[triggerTarget?.triggerCode] = (
          <TriggerExServiceProductList />
        );
        setScenes({ ...sceneMapTriggerProductListExService });
        break;
    }
  };

  const showScreenCategory = () => {
    switch (triggerTarget?.productType) {
      // Finance
      case PRODUCT_TYPE.FINANCE:
        let sceneMapTriggerCategoryFinance = {};
        sceneMapTriggerCategoryFinance[triggerTarget?.triggerCode] = <TriggerCreditCategoryList />;
        setScenes({ ...sceneMapTriggerCategoryFinance });
        break;

      case PRODUCT_TYPE.INSURANCE:
        let sceneMapTriggerCategoryInsurance = {};
        sceneMapTriggerCategoryInsurance[triggerTarget?.triggerCode] = (
          <TriggerInsuranceCategoryList />
        );
        setScenes({ ...sceneMapTriggerCategoryInsurance });
        break;

      case PRODUCT_TYPE.EXTRA_SERVICE:
        let sceneMapTriggerCategoryExService = {};
        sceneMapTriggerCategoryExService[triggerTarget?.triggerCode] = (
          <TriggerExServiceCategoryList fromCreateLead={fromCreateLead} changeTab={changeTabByTriggerCode} />
        );
        setScenes({ ...sceneMapTriggerCategoryExService });
        break;
    }
  };

  const showScreenProduct = () => {
    let trigger = triggers.find(t => t.triggerCode === triggerTarget?.triggerCode);
    switch (triggerTarget?.productType) {
      // Finance
      case PRODUCT_TYPE.FINANCE:
        let sceneMapTriggerProductFinance = {};
        sceneMapTriggerProductFinance[triggerTarget?.triggerCode] = (
          <CreditProductDetail route={{ params: { item: { id: trigger.entityId } } }} />
        );
        setScenes({ ...sceneMapTriggerProductFinance });
        break;

      case PRODUCT_TYPE.INSURANCE:
        let sceneMapTriggerProductInsurance = {};
        sceneMapTriggerProductInsurance[triggerTarget?.triggerCode] = (
          <InsuranceDetailScreen route={{ params: { item: { id: trigger.entityId } } }} />
        );
        setScenes({ ...sceneMapTriggerProductInsurance });
        break;

      case PRODUCT_TYPE.EXTRA_SERVICE:
        console.log('triggerTarget', triggerTarget);
        let sceneMapTriggerProductExService = {};
        sceneMapTriggerProductExService[triggerTarget?.triggerCode] = (
          <ExtraServiceDetail
            fromCreateLead={fromCreateLead}
            fromTriggerFlow={true}
            changeTab={changeTabByTriggerCode}
            //route={{ params: { item: { id: trigger.entityId } } }}
            data={categoryFlow}
          />
        );
        setScenes({ ...sceneMapTriggerProductExService });
        break;
    }
  };
  const showScreenProcess = () => {
    switch (triggerTarget?.productType) {
      // Finance
      case PRODUCT_TYPE.FINANCE:
        let sceneMapCredit = {};
        sceneMapCredit[triggerTarget?.triggerCode] = <CreditFilterScreen />;
        setScenes({ ...sceneMapCredit });
        break;

      // Finance
      case PRODUCT_TYPE.INSURANCE:
        let sceneMapInsurance = {};
        sceneMapInsurance[triggerTarget?.triggerCode] = <InsuranceListScreen />;
        setScenes({ ...sceneMapInsurance });
        break;

      // Extra_Service
      case PRODUCT_TYPE.EXTRA_SERVICE:
        let sceneMapExtraService = {};
        sceneMapExtraService[triggerTarget?.triggerCode] = <ExtraServiceList fromCreateLead={fromCreateLead} />;
        setScenes({ ...sceneMapExtraService });
        break;
    }
  };

  const renderScene = ({ route }) => {
    return scenes[route?.key];
  };

  return (
    <View style={styles.container}>
      <AppLoading loading={isLoading} />
      {routes.length > 0 && (
        <>
          <TriggerTabHeader tabs={routes} tabIndex={index} onPress={onChangeTab} />
          {renderScene({ route: routes[index] })}
        </>
      )}
    </View>
  );
};
export default React.memo(TriggerFlow);
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR.White, paddingTop: 10 },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: scale(170),
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
    //width: 'auto',
    width: scale(185)
  },
  tabViewLayout: {
    width: DEVICE_WIDTH
  },
  tabBarIndicatorStyle: {
    height: 0
  },
  subHeadTitle: {
    fontSize: 14,
    marginLeft: scale(10),
    maxWidth: scale(100)
  },
  imageIcon: {
    borderRadius: 4,
    width: scale(40),
    height: scale(40)
  }
});
