import { getExtraServiceDetailHandle } from '../../../redux/actions/extraService';
import { useNavigation } from '@react-navigation/native';
import { DEVICE_HEIGHT, DEVICE_WIDTH, SPACING } from '../../../constants/size';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { Title3 } from '../../../components/';
import StickyHeader from './components/sticky_header';
import { scale } from '../../../utils/responsive';
import CategoryDescription from './components/category_description';
import { AppLoading, SelectionModal } from '../../../components';
import InputStep1 from './components/input_step_1';
import ProgressPurchase from '../../insurance/components/progress_purchase';
import InputStep2 from './components/input_step_2';
import CategoryInfo from './components/category_info';
import Description from './components/description';
import InputStep3 from './components/input_step_3';
import GroupService from '../../../components/group_service';
import { getInfoServiceHandle, getListTriggerHandle } from '../../../redux/actions/masterData';
import SCREENS_NAME from '../../../constants/screens';
import { apiGetChildrenCategoryById } from '../../../services/api/extraServiceApi';

const triggerType = 1;

const ExtraServiceDetail = props => {
  const { item } = props?.route?.params || {};
  const { data } = props; //data from trigger code flow
  const { fromTriggerFlow, changeTab, fromCreateLead } = props || {};
  const navigation = useNavigation();
  const [detailItem, setDetailItem] = useState(null);
  const [isLoading, setLoading] = useState(fromTriggerFlow ? false : true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectionPopup, setSelectionPopup] = useState({
    title: '',
    visible: false,
    showLoading: false,
    value: null,
    data: []
  });

  const [currentCategory, setCurrentCategory] = useState(null); // category for step 1
  const [currentPartner, setCurrentPartner] = useState(null); // partner for step 2

  const [categoryList, setCategoryList] = useState([]);
  const dispatch = useDispatch();
  const translationY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();
  const [stickyComponent, setStickyComponent] = useState({ offsetY: 0, height: 0 });

  const { infoService, listTrigger } = useSelector(state => state.masterData);
  const dataInfoService = infoService?.data;
  const dataListTrigger = listTrigger?.data;

  useEffect(() => {
    dispatch(getInfoServiceHandle());
    dispatch(getListTriggerHandle({ params: { TriggerType: triggerType } }));
  }, []);

  const selectService = service => {
    let triggerCode = service?.triggerCode;
    if (triggerCode) {
      // product_trigger
      let routeName = SCREENS_NAME.TRIGGER_FLOW_SCREEN;
      const params = { triggerCode };
      fromTriggerFlow ? changeTab(triggerCode) : navigation.navigate(routeName, params);
    }
  };
  const onFetchCategoryChildList = async () => {
    const categoryList = await apiGetChildrenCategoryById({ id: data?.id });
    categoryList?.status === 200 && setCategoryList(categoryList?.data?.result?.items);
  };
  useEffect(() => {
    // extra service detail from trigger flow
    if (data?.id) {
      setDetailItem(data);
      onFetchCategoryChildList();
    }
  }, [data?.id]);
  useEffect(() => {
    if (!fromTriggerFlow) {
      // extra service detail not trigger flow
      const callback = (detail, categoryList) => {
        setLoading(false);
        setDetailItem(detail);
        setCategoryList(categoryList);
      };
      dispatch(getExtraServiceDetailHandle({ CategoryId: item?.id || 0, callback }));
    }
  }, []);
  const handleScrollToStickyComponent = () => {
    scrollViewRef?.current?.scrollTo({ x: 0, y: stickyComponent.offsetY, animated: true });
  };

  useEffect(() => {
    if (currentStep === 3 && scrollViewRef?.current) {
      scrollViewRef?.current?.scrollTo({ x: 0, y: stickyComponent.offsetY, animated: true });
    }
  }, [currentStep]);

  return (
    <View style={styles.container}>
      <AppLoading loading={isLoading} />
      {currentStep != 3 ? (
        <StickyHeader
          translationY={translationY}
          //distance offset top + height sticky component
          currentStep={currentStep}
          offsetYToBottom={stickyComponent.offsetY + stickyComponent.height}
          handleScrollToComponent={handleScrollToStickyComponent}
        />
      ) : null}
      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: translationY } }
            }
          ],
          { useNativeDriver: false }
        )}>
        {detailItem?.categoryDetailDesc || detailItem?.categoryMobileBanner ? (
          <View style={styles.image}>
            {detailItem?.categoryDetailDesc ? (
              <CategoryDescription content={detailItem?.categoryDetailDesc} />
            ) : null}
            {detailItem?.categoryMobileBanner ? (
              <FastImage
                source={{
                  uri: detailItem.categoryMobileBanner
                }}
                style={styles.image}
              />
            ) : null}
          </View>
        ) : null}

        <CategoryInfo detailItem={detailItem} />
        <View style={{ paddingTop: scale(24), marginTop: scale(10), backgroundColor: '#FFF' }}>
          <Title3 style={{ paddingHorizontal: scale(15) }}>
            Chỉ 3 bước đơn giản để gửi yêu cầu dịch vụ
          </Title3>
          <ProgressPurchase
            style={{ marginTop: scale(32) }}
            currentStepIndex={currentStep - 1}
            stepList={[
              'extra_service_detail.choose_product_and_service',
              'extra_service_detail.choose_partner',
              'extra_service_detail.required_service'
            ]}
          />
        </View>
        <View
          style={{ paddingVertical: 20, backgroundColor: '#FFF' }}
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            setStickyComponent({ offsetY: layout.y, height: layout.height });
          }}>
          {currentStep === 1 && (
            <InputStep1
              categoryList={categoryList}
              setSelectionPopup={setSelectionPopup}
              currentCategory={currentCategory}
              setCurrentCategory={setCurrentCategory}
              setCurrentStep={setCurrentStep}
            />
          )}
          {currentStep === 2 && (
            <InputStep2
              setLoading={setLoading}
              currentCategory={currentCategory}
              currentPartner={currentPartner}
              setCurrentStep={setCurrentStep}
              setCurrentPartner={setCurrentPartner}
              setCurrentCategory={setCurrentCategory}
            />
          )}
          {currentStep === 3 && (
            <InputStep3
              fromCreateLead={fromCreateLead}
              setLoading={setLoading}
              setSelectionPopup={setSelectionPopup}
              currentCategory={currentCategory}
              currentPartner={currentPartner}
              setCurrentStep={setCurrentStep}
              setCurrentPartner={setCurrentPartner}
              setCurrentCategory={setCurrentCategory}
            />
          )}
        </View>
        <Description content={detailItem?.description} />
        <View
          style={{
            paddingHorizontal: scale(15),
            marginVertical: scale(15),
            backgroundColor: '#FFF'
          }}>
          <GroupService
            data={dataListTrigger}
            onPress={selectService}
            dataInfoService={dataInfoService}
          />
        </View>
      </Animated.ScrollView>

      <SelectionModal
        showLoading={selectionPopup?.showLoading}
        title={selectionPopup?.title}
        visible={selectionPopup?.visible}
        value={selectionPopup?.value}
        onConfirm={selectionPopup?.onConfirm}
        onClose={selectionPopup?.onClose}
        data={selectionPopup?.data || []}
      />
    </View>
  );
};

export default React.memo(ExtraServiceDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FB'
  },
  additionalServiceDetailsWrapper: {
    flex: 1
  },
  wrapper: {
    paddingBottom: SPACING.HtmlBottom,
    backgroundColor: '#FFF'
  },
  image: {
    height: DEVICE_WIDTH / 1.19,
    width: DEVICE_WIDTH
  }
});
