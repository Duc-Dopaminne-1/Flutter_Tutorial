import React, { ReactElement, useEffect, useState } from 'react';
import { FlatList, TextStyle, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getSexualOrientation, updateSexualOrientation } from '@/redux/user/actions';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import SexualItem from './components/SexualItem';
import { SEXUAL_ORIENTATION_MODEL } from '@/models/sexual-orirentation';
import { UserInit } from '@/redux/user/reducer';
import { useNavigation } from '@react-navigation/native';
import { SafeArea } from '@/components/SafeArea';
import { language } from '@/i18n';
import DefaultText from '@/components/CustomText/DefaultText';
import CustomButton from '@/components/CustomButton';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import IconBack from '@/components/SVG/BackSvg';
import NavigationActionsService from '@/navigation/navigation';
import { alertError } from '@/shared/alert';

const MAX_SELECT = 3;

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: colors.white,
};

const WRAPPER_HEADER: ViewStyle = {
  marginBottom: 20,
  justifyContent: 'center',
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
};
const FLAT_LIST: ViewStyle = {
  flex: 1,
  marginTop: 7,
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
  marginTop: 20,
  marginHorizontal: 15,
  marginBottom: 50,
};

export function ProfileEditSexualOrientationScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { sexualOrientations } = useSelector((state: UserInit) => state.user.data);
  const [sexualOrientationsList, setSexualOrientationsList] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [listSelected, setListSelected] = useState<number[]>([]);

  useEnableHardwareBackButton();

  useEffect(() => {
    // setIsLoading(true);
    dispatch(
      getSexualOrientation({
        onSuccess: items => {
          setSexualOrientationsList([...items]);
          // setIsLoading(false);
        },
        onFail: (_message: string) => {
          // setIsLoading(false);
        },
      }),
    );
    const sexualOrientationsId = (sexualOrientations && sexualOrientations.map(item => item.id)) || [];
    setListSelected([...sexualOrientationsId]);
  }, []);

  const onUpdateSuccess = async () => {
    NavigationActionsService.hideLoading();
    navigation.goBack();
  };

  const onUpdateFail = async error => {
    NavigationActionsService.hideLoading();
    alertError(error.message, language('error'), null);
  };

  const saveButtonOnPressed = async () => {
    NavigationActionsService.showLoading();
    dispatch(updateSexualOrientation({ sexualOrientations: listSelected, callback: { onSuccess: onUpdateSuccess, onFail: onUpdateFail } }));
  };

  const cellOnPressed = (item: SEXUAL_ORIENTATION_MODEL) => {
    let newArray = [...listSelected];
    if (listSelected.includes(item.id)) {
      newArray = listSelected.filter(id => id !== item.id);
    } else {
      if (newArray.length < MAX_SELECT) newArray.push(item.id);
    }
    setListSelected(newArray);
  };

  const renderItem = ({ item }) => {
    return <SexualItem item={item} onPress={cellOnPressed} listSelected={listSelected} maxItems={3} />;
  };

  const keyExtractor = (item: SEXUAL_ORIENTATION_MODEL) => item.id.toString();

  return (
    <View style={CONTAINER}>
      <SafeArea />
      <View style={WRAPPER_HEADER}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={TITLE} title={language('profileGeneral.sexualOrientation')} />
      </View>

      <DefaultText {...{ style: DESCRIPTION_TEXT }}>{language('profileGeneral.selectUpTo3')}</DefaultText>

      <FlatList
        style={FLAT_LIST}
        scrollToOverflowEnabled={false}
        data={sexualOrientationsList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        extraData={sexualOrientationsList}
      />
      <CustomButton onPress={saveButtonOnPressed} containerStyle={BUTTON_SAVE} text={language('save')} textStyle={BUTTON_TITLE} />
    </View>
  );
}
