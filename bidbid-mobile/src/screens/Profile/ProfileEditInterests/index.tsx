import React, { ReactElement, useEffect, useState } from 'react';
import { TextStyle, View, ViewStyle, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getInterest, updateUser } from '@/redux/user/actions';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { alertError } from '@/shared/alert';
import { UserInit } from '@/redux/user/reducer';
import { useNavigation } from '@react-navigation/native';
import { getDiscoveryDetail } from '@/redux/discovery/actions';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import CustomButton from '@/components/CustomButton';
import SexualItem from '@/screens/Profile/ProfileEditSexualOrientation/components/SexualItem';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import ErrorMessage from '@/components/ErrorMessage';
import IconBack from '@/components/SVG/BackSvg';
import NavigationActionsService from '@/navigation/navigation';

const MAX_SELECT = 5;

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: colors.white,
};

const WRAP_LIST: ViewStyle = {
  flex: 1,
  marginTop: 7,
};

const WRAP_ERROR: ViewStyle = {
  alignSelf: 'center',
};

const WRAPPER_HEADER: ViewStyle = {
  marginBottom: 20,
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
};

const DESCRIPTION_TEXT: TextStyle = {
  marginHorizontal: 15,
  fontSize: fonts.size.s16,
  color: colors.red_700,
};

const BUTTON_TITLE: TextStyle = {
  fontWeight: '400',
};

const BUTTON_SAVE: ViewStyle = {
  width: null,
  marginBottom: 50,
  marginTop: 20,
  marginHorizontal: 15,
};

export function ProfileEditInterestsScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [dataList, setDataList] = useState([]);
  const [dataSelectedList, setDataSelectedList] = useState([]);
  const userId = useSelector((state: UserInit) => state.user.data.id);
  const [isError, setIsError] = useState(false);

  useEnableHardwareBackButton();

  useEffect(() => {
    dispatch(
      getDiscoveryDetail({
        userId,
        onSuccess: onGetUserSuccess,
        onFail: onFail,
      }),
    );
    dispatch(
      getInterest({
        isFromRegister: false,
        onSuccess,
        onFail: onFail,
      }),
    );
  }, []);

  const onGetUserSuccess = (data: any) => {
    if (data) {
      const value = data.interests.length > 0 ? data.interests.map(item => item.id) : [];
      setDataSelectedList(value);
    }
  };

  const onSuccess = (data: any) => {
    setDataList(data ? data.items : []);
  };

  const onFail = (err: string) => {
    NavigationActionsService.hideLoading();
    alertError(err);
  };

  const saveOnPressed = () => {
    if (dataSelectedList.length < 2) {
      setIsError(true);
      return;
    }

    NavigationActionsService.showLoading();
    dispatch(
      updateUser({
        interestIds: dataSelectedList,
        userId: userId,
        onSuccess: onUpdateSuccess,
        onFail: onFail,
      }),
    );
  };

  const onUpdateSuccess = () => {
    NavigationActionsService.hideLoading();
    navigation.goBack();
  };

  const interestItemOnPressed = item => {
    if (isError) {
      setIsError(false);
    }
    let newArray = [...dataSelectedList];
    if (dataSelectedList.includes(item.id)) {
      newArray = dataSelectedList.filter(i => i !== item.id);
    } else {
      if (newArray.length < MAX_SELECT) newArray.push(item.id);
    }
    setDataSelectedList(newArray);
  };

  const keyExtractor = item => item.id.toString();

  const renderItem = ({ item }) => {
    return <SexualItem item={item} onPress={interestItemOnPressed} listSelected={dataSelectedList} maxItems={5} />;
  };

  return (
    <View style={CONTAINER}>
      <SafeArea />
      <View style={WRAPPER_HEADER}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={TITLE} title={language('profileGeneral.editInterests')} />
      </View>
      <DefaultText {...{ style: DESCRIPTION_TEXT }}>{language('profileGeneral.select5Interests')}</DefaultText>

      <View style={WRAP_ERROR}>
        <ErrorMessage errorValue={isError ? language('register.socialError') : ''} />
      </View>

      <FlatList
        style={WRAP_LIST}
        scrollToOverflowEnabled={false}
        data={dataList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={dataList}
      />
      <CustomButton onPress={saveOnPressed} containerStyle={BUTTON_SAVE} text={language('save')} textStyle={BUTTON_TITLE} />
    </View>
  );
}
