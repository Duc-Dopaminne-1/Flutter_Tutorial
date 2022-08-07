import { styles } from './styles';
import { TEXT_COLOR } from '../../../constants/colors';
import CalcLoan from '../components/calc_loan';
import { TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { ActionKeyboardView, PrimaryButton, SubHead } from '../../../components/';
import React, { useCallback, useEffect, useLayoutEffect, useState, useContext } from 'react';
import {
  setProductListFilter,
  clearLeadContactForCredit,
  getAllCategoryHandle
} from '../../../redux/actions/credit';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SCREENS_NAME from '../../../constants/screens';
import { handleTouch } from '../../../helpers/handleTouch';
import { EVENT_TYPE } from '../../../constants/analyticEnums';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';
import { isIphoneX } from '../../../helpers/device';
import { SPACING } from '../../../constants/size';

const Product = props => {
  const theme = useContext(themeContext);
  const { filter } = useSelector(state => state.credit.orderMemo || {});
  const { topenId } = useSelector(state => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const onPress = useCallback(
    event => {
      handleTouch(
        event,
        SCREENS_NAME.CREATE_SUPPORT_SCREEN,
        props.route,
        topenId,
        EVENT_TYPE.REQUEST_SUPPORT
      );
      navigation.navigate('CreateSupportScreen');
    },
    [topenId, navigation, props.route]
  );
  const productFilter = useSelector(state => state.credit?.productFilter);

  const [dataInput, setDataInput] = useState({});

  const onChange = useCallback(value => {
    setDataInput(pre => {
      return { ...pre, ...value };
    });
  }, []);

  useLayoutEffect(() => {
    dispatch(getAllCategoryHandle());
  }, []);

  useEffect(() => {
    setDataInput(productFilter);
  }, [productFilter]);

  useEffect(() => {
    if (filter) {
      setDataInput(filter);
    }
  }, [filter]);

  useEffect(() => {
    navigation.setOptions({
      backAction: () => {
        dispatch(clearLeadContactForCredit());
        navigation.goBack();
      }
    });
  }, [navigation, dispatch]);

  const viewProduct = () => {
    dispatch(setProductListFilter({ ...dataInput }));
    navigation.navigate(SCREENS_NAME.CREDIT_SUGGESTED_SCREEN);
  };

  const validateData = value => {
    return value.categoryId > 0;
  };

  return (
    <View forceInset={{ bottom: 'never' }} style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.body}
        extraHeight={80}
        keyboardOpeningTime={-1}
        enableResetScrollToCoords={false}
        showsVerticalScrollIndicator={false}>
        <CalcLoan dataInput={dataInput} onChange={onChange} />
      </KeyboardAwareScrollView>
      <ActionKeyboardView
        keyboardVerticalOffset={scale(80)}
        style={{ paddingBottom: isIphoneX ? 0 : SPACING.Medium }}>
        <TouchableOpacity onPress={onPress} style={styles.groupCallSupport}>
          <SubHead bold={false} translate color={theme.app.primaryColor1}>
            {'loan_calc.request_support'}
          </SubHead>
        </TouchableOpacity>
        <PrimaryButton
          translate
          title={'product_screen.product_suggestions'}
          onPress={viewProduct}
          disabled={!validateData(dataInput)}
        />
      </ActionKeyboardView>
    </View>
  );
};

export default Product;
