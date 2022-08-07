import { useNavigation } from '@react-navigation/native';
import { setLeadContactForCredit } from '../../../redux/actions/credit';
import { setLeadContactForExtraService } from '../../../redux/actions/extraService';
import { setLeadContactForInsurance } from '../../../redux/actions/insurance';
import {
  ICBalance01,
  ICCreateRequest,
  ICCreateSupport,
  ICCurrency,
  ICInsurrance02,
  ICRadioCheck,
  ICRadioUncheck
} from '../../../assets/icons';
import { FloatFooter, Heading, SmallText, SubHead } from '../../../components/';
import PrimaryButton from '../../../components/primary_button';
import { CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import React, { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import styles from './styles';
import themeContext from '../../../constants/theme/themeContext';

const SelectProductType = props => {
  const theme = useContext(themeContext);
  const { leadId, contactId } = props.route?.params || {};
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const ProductType = [
    {
      type: '0',
      title: 'application.loan',
      description: 'application.loan_des',
      icon: props => <ICCurrency width={scale(48)} height={scale(48)} {...props} />
    },
    {
      type: '1',
      title: 'application.insurance',
      description: 'application.insurance_des',
      icon: props => <ICInsurrance02 width={scale(48)} height={scale(48)} {...props} />
    },
    {
      type: '2',
      title: 'application.addition_service',
      description: 'application.addition_service_des',
      icon: props => <ICBalance01 width={scale(48)} height={scale(48)} {...props} />
    },
    {
      type: '3',
      title: 'application.create_request',
      description: 'application.create_request_description',
      icon: props => <ICCreateRequest width={scale(48)} height={scale(48)} {...props} />
    },
    {
      type: '4',
      title: 'application.create_request_support',
      description: 'application.create_request_support_description',
      icon: props => <ICCreateSupport width={scale(48)} height={scale(48)} {...props} />
    }
  ];

  const [type, setType] = useState('');
  const [listTab, setListTab] = useState([]);
  const featureList = useSelector(state => state.toggleFeature.featureList);

  const onCreate = () => {
    if (type === '0') {
      dispatch(setLeadContactForCredit({ leadId, contactId }));
      navigation.navigate(SCREENS_NAME.CREDIT_FILTER_SCREEN);
    } else if (type === '1') {
      dispatch(setLeadContactForInsurance({ leadId, contactId }));
      navigation.navigate(SCREENS_NAME.INSURANCE_LIST_SCREEN);
    } else if (type === '2') {
      dispatch(setLeadContactForExtraService({ leadId, contactId }));
      navigation.navigate(SCREENS_NAME.EXTRA_SERVICE_LIST_SCREEN);
    } else if (type === '3') {
      navigation.navigate(SCREENS_NAME.CREATE_OR_EDIT_LEAD_SCREEN);
    } else if (type === '4') {
      navigation.navigate(SCREENS_NAME.CREATE_SUPPORT_SCREEN);
    }
  };

  useEffect(() => {
    let tmp = [];
    if (featureList?.includes('credit')) {
      tmp.push(0);
    }
    if (featureList?.includes('insurance')) {
      tmp.push(1);
    }
    tmp.push(2); //extra-service
    tmp.push(3); //lead
    tmp.push(4); //loan-calc
    setListTab(tmp);
  }, [featureList]);

  const renderChecked = value =>
    value ? <ICRadioCheck color1={theme?.app?.primaryColor1} /> : <ICRadioUncheck />;

  const renderItem = item => {
    return (
      <TouchableOpacity
        key={item?.type}
        style={[
          styles.cardWrapper,
          type === item.type ? { borderColor: theme.app.primaryColor1 } : {}
        ]}
        onPress={() => setType(item.type)}>
        <View style={styles.cardLeft}>
          {item.icon({ color1: theme?.icon?.color1, color2: theme?.icon?.color2 })}
        </View>
        <View style={styles.cardRight}>
          <SubHead semiBold translate>
            {item.title}
          </SubHead>
          <SmallText translate color={theme?.text?.secondary} style={{ marginTop: SPACING.Small }}>
            {item.description}
          </SmallText>
        </View>
        <View style={styles.checkRadio}>{renderChecked(type === item.type)}</View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.createContactProfileWrapper}>
      <View style={styles.header}>
        <Heading translate>{'application.select_product_type'}</Heading>
      </View>
      {ProductType.map((tab, index) => (listTab.includes(index) ? renderItem(tab) : null))}
      <FloatFooter>
        <PrimaryButton
          translate
          onPress={() => onCreate(type)}
          title={'application.create'}
          disabled={type === ''}
        />
      </FloatFooter>
    </View>
  );
};

export default SelectProductType;
