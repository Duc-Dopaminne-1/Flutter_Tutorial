import React, { useCallback, useEffect, useContext } from 'react';
import styles from './styles';
import { View, TouchableOpacity } from 'react-native';
import { ExpandView } from '../../../components/';
import TextView from '../../../components/text_view';
import FloatFooter from '../../../components/float_footer';
import { ICCaretDown1, ICSuccess, ICTick } from '../../../assets/icons';
import { Heading, PrimaryButton } from '../../../components/';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { createExtraServiceOrderClear } from '../../../redux/actions/extraService';
import AppText from '../../../components/app_text';
import SCREENS_NAME from '../../../constants/screens';
import { ScrollView } from 'react-native-gesture-handler';
import themeContext from '../../../constants/theme/themeContext';

const CreateOrderSuccess = props => {
  const theme = useContext(themeContext);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const name = route.params?.name || '';
  const createOrderResult = useSelector(state => state.extraService.createOrderResult);

  useEffect(() => {
    navigation.setOptions({ hideLeftHeader: true });
  }, []);

  const _goToApplicationServiceDetail = useCallback(() => {
    navigation.replace(SCREENS_NAME.EXTRA_SERVICE_ORDER_DETAIL_SCREEN, {
      item: createOrderResult,
      goBack: SCREENS_NAME.APPLICATION_LIST_SCREEN
    });
    dispatch(createExtraServiceOrderClear());
  }, [navigation, dispatch, createOrderResult]);

  const goBackProductList = useCallback(() => {
    navigation.navigate(SCREENS_NAME.MIDDLEWARE);
    dispatch(createExtraServiceOrderClear());
  }, [navigation, dispatch]);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.successWrapper}>
          <ICSuccess />
          <Heading translate textAlign={'center'} numberOfLines={2} style={styles.successText}>
            {'result_additional_services.success_text'}
          </Heading>
          <ExpandView
            translateTitle
            style={styles.expandView}
            title={'insurance_screen.profile_information'}
            canExpand={false}>
            <>
              <TextView
                translate
                type={'text'}
                title={'insurance_screen.profile_code'}
                value={createOrderResult?.orderCode || ''}
              />
              <TextView
                translate
                type={'text'}
                value={name || ''}
                title={'insurance_screen.products_name'}
              />
              <TextView
                translate
                type={'text'}
                value={route.params?.data?.partnerName || ''}
                title={'insurance_screen.supplier'}
              />
              <TouchableOpacity
                onPress={_goToApplicationServiceDetail}
                style={styles.showdetailWrapper}>
                <AppText
                  translate
                  semiBold
                  style={[styles.showdetail, { color: theme.app.primaryColor2 }]}>
                  {'result_additional_services.view_profile'}
                </AppText>
                <ICCaretDown1 stroke={theme.app.primaryColor2} />
              </TouchableOpacity>
            </>
          </ExpandView>
        </View>
      </ScrollView>
      <FloatFooter style={styles.backToHome}>
        <PrimaryButton translate onPress={goBackProductList} title={'common.back_to_main_screen'} />
      </FloatFooter>
    </>
  );
};

CreateOrderSuccess.propTypes = {
  // bla: PropTypes.string,
};

CreateOrderSuccess.defaultProps = {
  // bla: 'test',
};

export default CreateOrderSuccess;
