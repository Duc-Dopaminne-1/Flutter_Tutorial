import React, { ReactElement, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateCompany } from '@/redux/user/actions';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { PROFILE_EDIT_COMPANY_SEARCH } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import CompanyItem from '@/screens/Profile/ProfileEditCompany/components/CompanyItem';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import IconBack from '@/components/SVG/BackSvg';

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: colors.white,
};

const WRAPPER_HEADER: ViewStyle = {
  marginBottom: 20,
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
};

export function ProfileEditCompanyScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEnableHardwareBackButton();

  const [modalVisible, setModalVisible] = useState(false);

  const { company } = useSelector((state: UserInit) => {
    return state.user.data;
  });

  const onBackdropPress = () => {
    setModalVisible(false);
  };

  const deleteOnPressedCallback = () => {
    dispatch(updateCompany({ companyId: null }));
  };

  const schoolItemOnPressed = (type: any) => {
    if (type === 'Add Company') {
      navigation.navigate(PROFILE_EDIT_COMPANY_SEARCH);
    } else {
      setModalVisible(true);
    }
  };

  const renderAddSchoolItem = () => <CompanyItem schoolItemOnPressed={schoolItemOnPressed} type="Add Company" />;
  const renderMainContent = () => {
    if (company === undefined || company === null) return renderAddSchoolItem();
    return <CompanyItem item={company} schoolItemOnPressed={schoolItemOnPressed} type="Other" />;
  };

  return (
    <View style={CONTAINER}>
      <SafeArea />
      <View style={WRAPPER_HEADER}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={TITLE} title={language('profileGeneral.company')} />
      </View>
      {renderMainContent()}
      {/* {renderSaveButton()} */}
      <DeleteConfirmDialog isVisible={modalVisible} onBackdropPress={onBackdropPress} confirmOnPressedCallback={deleteOnPressedCallback} />
    </View>
  );
}
