import React, { ReactElement, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateJob } from '@/redux/user/actions';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { PROFILE_EDIT_JOB_SEARCH } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import JobItem from '@/screens/Profile/ProfileEditJob/components/JobItem';
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

export function ProfileEditJobScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEnableHardwareBackButton();

  const [modalVisible, setModalVisible] = useState(false);

  const { job } = useSelector((state: UserInit) => {
    return state.user.data;
  });

  const onBackdropPress = () => {
    setModalVisible(false);
  };

  const deleteOnPressedCallback = () => {
    dispatch(updateJob({ jobId: null }));
  };

  const schoolItemOnPressed = (type: any) => {
    if (type === 'Add Job') {
      navigation.navigate(PROFILE_EDIT_JOB_SEARCH);
    } else {
      setModalVisible(true);
    }
  };

  const renderAddSchoolItem = () => <JobItem schoolItemOnPressed={schoolItemOnPressed} type="Add Job" />;
  const renderMainContent = () => {
    if (job === undefined || job === null) return renderAddSchoolItem();
    return <JobItem item={job} schoolItemOnPressed={schoolItemOnPressed} type="Other" />;
  };

  return (
    <View style={CONTAINER}>
      <SafeArea />
      <View style={WRAPPER_HEADER}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={TITLE} title={language('profileGeneral.jobTitle')} />
      </View>
      {renderMainContent()}
      {/* {renderSaveButton()} */}
      <DeleteConfirmDialog isVisible={modalVisible} onBackdropPress={onBackdropPress} confirmOnPressedCallback={deleteOnPressedCallback} />
    </View>
  );
}
