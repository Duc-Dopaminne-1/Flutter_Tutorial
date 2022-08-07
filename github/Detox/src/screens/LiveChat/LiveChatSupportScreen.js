import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {useGetUserByIdLazyQuery} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../appData/appContext/appContext';
import {getUser} from '../../appData/user/selectors';
import {FETCH_POLICY, MAX_LENGTH} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {METRICS, normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import BaseScreen from '../../components/BaseScreen';
import CustomButton from '../../components/Button/CustomButton';
import DropdownWithTitle from '../../components/DropdownWithTitle';
import InputSection from '../../components/InputSection';
import KeyboardScrollView from '../../components/KeyboardScrollView';
import {Loading} from '../../components/SectionHorizontalList';
import {getUserFullName} from '../../utils/UserAgentUtil';
import ValidateInput from '../../utils/ValidateInput';
import {StringeeContext} from '../Call/StringeeContext';
import {useMount} from '../commonHooks';
import ScreenIds from '../ScreenIds';

export const LiveChatSupportScreen = ({navigation, route}) => {
  const {userId} = route?.params ?? {};
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState('');
  const [selectedQueueId, setSelectedQueueId] = useState('');
  const {showErrorAlert} = useContext(AppContext);
  const currentUser = useSelector(getUser);

  const {
    liveChat: {chatProfile, getChatProfile, onPressConnect},
  } = useContext(StringeeContext);

  const {startApi: getUserInfo, data} = useGraphqlApiLazy({
    graphqlApiLazy: useGetUserByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    dataField: 'userById',
    showSpinner: true,
  });

  const userFullName = getUserFullName(data?.userDto) ?? '';
  const userPhoneNumber = data?.userDto?.phoneNumber ?? '';
  const userEmail = data?.userDto?.email ?? '';

  useMount(() => {
    getChatProfile({
      onError: () => {
        showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR), () => {
          navigation.goBack();
        });
      },
    });

    if (userId || currentUser?.id) {
      getUserInfo({variables: {userId: userId ?? currentUser?.id}});
    }
  });

  const validateForm = () => {
    const errorsObj = {
      selectedQueueId: ValidateInput.checkRequiredField(selectedQueueId),
      description: ValidateInput.checkRequiredField(description),
    };
    setErrors(errorsObj);
    for (const [, value] of Object.entries(errorsObj)) {
      if (value) {
        return false;
      }
    }
    return true;
  };

  const onPressCancel = () => {
    navigation.goBack();
  };

  const onPressSend2 = () => {
    if (!validateForm()) {
      return;
    }
    onPressConnect(userFullName, userEmail);
    navigation.navigate(ScreenIds.LiveChatRoom, {
      queueId: selectedQueueId.id,
      description,
      name: userFullName,
      email: userEmail,
      phone: userPhoneNumber,
    });
  };

  const loading = !chatProfile?.queues;

  return (
    <BaseScreen testID={ScreenIds.LiveChatSupport} title={translate('liveChatSupport.screenTitle')}>
      <Loading loading={loading}>
        <KeyboardScrollView contentStyle={styles.container}>
          <InputSection
            headerTitle={translate(STRINGS.YOUR_NAME)}
            headerStyles={styles.phoneNumberHeader}
            isRequired
            inputStyle={{...commonStyles.inputBorder}}
            value={userFullName}
            editable={false}
          />
          <InputSection
            headerTitle={translate(STRINGS.YOUR_PHONE_NUMBER)}
            headerStyles={styles.phoneNumberHeader}
            isRequired
            inputStyle={{...commonStyles.inputBorder}}
            value={userPhoneNumber}
            editable={false}
          />
          <InputSection
            headerTitle={translate(STRINGS.EMAIL)}
            headerStyles={styles.phoneNumberHeader}
            isRequired
            inputStyle={{...commonStyles.inputBorder}}
            value={userEmail}
            editable={false}
          />

          <DropdownWithTitle
            inputStyle={commonStyles.dropdownInput}
            // eslint-disable-next-line sonarjs/no-duplicate-string
            title={translate('liveChatSupport.queuesHeader')}
            headerStyles={styles.phoneNumberHeader}
            dropdownPlaceHolderStyle={commonStyles.dropdownPlaceHolder}
            dropdownTitle={translate('liveChatSupport.queuesHeader')}
            popupTitle={translate('liveChatSupport.queuesHeader')}
            items={chatProfile?.queues ?? []}
            onChosen={setSelectedQueueId}
            isRequiredAtLeastOne
            isRequired
            emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
            error={!errors?.selectedQueueId ? '' : translate(errors?.selectedQueueId)}
          />

          <InputSection
            headerTitle={translate('liveChatSupport.noteHeader')}
            placeholder={translate('liveChatSupport.notePlaceholder')}
            headerStyles={styles.phoneNumberHeader}
            inputStyle={styles.textInputNote}
            value={description}
            error={errors?.description}
            onChangeText={setDescription}
            multiline
            maxLength={MAX_LENGTH.textArea}
          />
        </KeyboardScrollView>

        <View style={commonStyles.footerContainer}>
          <CustomButton
            style={styles.cancelButton}
            title={translate('liveChatSupport.buttonCancel')}
            titleColor={COLORS.TEXT_DARK_10}
            onPress={onPressCancel}
          />
          <CustomButton
            style={styles.sendButton}
            title={translate('liveChatSupport.buttonSend')}
            titleColor={COLORS.NEUTRAL_WHITE}
            onPress={onPressSend2}
          />
        </View>
      </Loading>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normal,
  },
  phoneNumberHeader: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.BLACK_31,
  },
  textInputNote: {
    width: '100%',
    height: 80,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    borderRadius: 4,
    ...METRICS.horizontalPadding,
  },
  cancelButton: {
    ...commonStyles.buttonNext,
    flex: 1,
    marginRight: 14,
    backgroundColor: COLORS.GREY_ED,
  },
  sendButton: {
    ...commonStyles.buttonNext,
    flex: 1,
    backgroundColor: COLORS.PRIMARY_A100,
  },
});
