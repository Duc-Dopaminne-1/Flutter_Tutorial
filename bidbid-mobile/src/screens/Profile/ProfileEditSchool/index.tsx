import React, { ReactElement, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateSchool } from '@/redux/user/actions';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import SchoolItem from './components/SchoolItem';
import { SchoolItemType } from './components/SchoolItem';
import { PROFILE_EDIT_SCHOOL_SEARCH } from '@/navigation/screenKeys';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import { SafeArea } from '@/components/SafeArea';
import { SCHOOL_MODEL } from '@/models/school';
import { language } from '@/i18n';
import DeleteConfirmDialog from './DeleteConfirmDialog';
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

export function ProfileEditSchoolScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEnableHardwareBackButton();

  const [modalVisible, setModalVisible] = useState(false);

  const { school } = useSelector((state: UserInit) => {
    return state.user.data;
  });

  const onBackdropPress = () => {
    setModalVisible(false);
  };

  const deleteOnPressedCallback = () => {
    dispatch(updateSchool({ schoolId: null }));
  };

  const schoolItemOnPressed = (type: SchoolItemType, _item?: SCHOOL_MODEL) => {
    if (type === 'Add School') {
      navigation.navigate(PROFILE_EDIT_SCHOOL_SEARCH);
    } else {
      // Alert.alert(
      //   language('alert.confirm'),
      //   language('alert.areYouWantToDelete'),
      //   [
      //     {
      //       text: language('alert.cancel'),
      //       onPress: () => undefined,
      //       style: 'cancel',
      //     },
      //     {
      //       text: language('alert.ok'),
      //       onPress: () => {
      //         dispatch(updateSchool({ schoolId: null }));
      //       },
      //     },
      //   ],
      //   { cancelable: false },
      // );
      setModalVisible(true);
    }
  };

  const renderAddSchoolItem = () => <SchoolItem schoolItemOnPressed={schoolItemOnPressed} type="Add School" />;
  const renderMainContent = () => {
    if (school === undefined || school === null) return renderAddSchoolItem();
    return <SchoolItem item={school} schoolItemOnPressed={schoolItemOnPressed} type="Other" />;
  };

  return (
    <View style={CONTAINER}>
      <SafeArea />
      <View style={WRAPPER_HEADER}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={TITLE} title={language('School')} />
      </View>
      {renderMainContent()}
      {/* {renderSaveButton()} */}
      <DeleteConfirmDialog isVisible={modalVisible} onBackdropPress={onBackdropPress} confirmOnPressedCallback={deleteOnPressedCallback} />
    </View>
  );
}
