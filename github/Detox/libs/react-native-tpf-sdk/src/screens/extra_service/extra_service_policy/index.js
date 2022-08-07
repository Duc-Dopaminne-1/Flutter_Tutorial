import React, { useCallback, useEffect, useState, useContext, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  clearLeadContactForExtraService,
  createExtraServiceOrderClear,
  createExtraServiceOrderHandle
} from '../../../redux/actions/extraService';
import { getShowAlertError } from '../../../redux/actions/system';
import { BodyText, PrimaryButton, SubHead } from '../../../components/';
import AppText from '../../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { ERROR_PROCESS_AND_TRY } from '../../../constants/errors';
import SCREENS_NAME from '../../../constants/screens';
import { SPACING } from '../../../constants/size';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';
import Heading from '../../../components/text/heading';
import { emitEvent } from '../../../utils/eventEmit';
import { SDK_EVENT_NAME } from '../../../global/app';

const ExtraServicePolicy = props => {
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const { route } = props;
  const { data } = route.params;
  const id = route.params?.id || '';
  const name = route.params?.name || '';

  const createOrderResult = useSelector(state => state.extraService.createOrderResult);

  const dispatch = useDispatch();

  useEffect(() => {
    if (createOrderResult?.isSuccess) {
      navigation.navigate(SCREENS_NAME.CREATE_ORDER_SUCCESS, {
        data,
        name,
        id
      });
      const eventData = { ...data, code: createOrderResult?.orderCode, id: createOrderResult?.id };
      emitEvent({ event_name: SDK_EVENT_NAME.EXTRA_SERVICE_APPLICATION_CREATE, data: eventData });
      dispatch(clearLeadContactForExtraService());
    } else if (createOrderResult?.isError) {
      dispatch(createExtraServiceOrderClear());
      dispatch(getShowAlertError(ERROR_PROCESS_AND_TRY));
    }
  }, [dispatch, createOrderResult, data]);

  const onContinue = useCallback(() => {
    dispatch(createExtraServiceOrderHandle(data));
  }, [data, dispatch]);

  const onPress = useCallback(() => {
    navigation.navigate(SCREENS_NAME.TERM_AND_CONDITION_SCREEN);
  }, [navigation]);

  const styleOrderNumber = useMemo(
    () => ({
      ...styles.sttText,
      color: theme?.app?.primaryColor1,
      fontFamily: theme?.fonts?.REGULAR
    }),
    [(styles, theme)]
  );

  return (
    <View forceInset={{ bottom: 'never' }} style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <AppText translate numberOfLines={2} style={styles.textTitle}>
          {'policy_extra_service.title'}
        </AppText>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>1. </Text>
          <AppText translate>{'policy_extra_service.content_01'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>2. </Text>
          <AppText translate>{'policy_extra_service.content_02'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>3. </Text>
          <AppText translate>{'policy_extra_service.content_03'}</AppText>
        </Text>
        <Text style={styles.decription}>
          <Text style={styleOrderNumber}>4. </Text>
          <AppText translate>{'policy_extra_service.content_04'}</AppText>
        </Text>
        <Text
          style={[
            styles.noteText,
            { color: theme.text.secondary, fontFamily: theme?.fonts?.ITALIC }
          ]}>
          <AppText translate>{'policy_extra_service.note'}</AppText>
        </Text>
      </ScrollView>
      <View style={styles.textContainer}>
        <AppText>
          <SubHead translate style={styles.message} medium>
            {'policy_subscription.license_accept_02'}
          </SubHead>{' '}
          <TouchableOpacity style={styles.policyContainer} onPress={onPress}>
            <SubHead translate medium color={theme.app.primaryColor2} style={styles.policy}>
              {'account.policy'}
            </SubHead>
          </TouchableOpacity>
        </AppText>
      </View>
      <View style={styles.btnContainer}>
        <PrimaryButton translate title={'common.confirm'} onPress={onContinue} />
      </View>
    </View>
  );
};

export default ExtraServicePolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  textTitle: {
    textAlign: 'center',
    marginBottom: SPACING.Large,
    lineHeight: LINE_HEIGHT.BodyText,
    fontSize: FONT_SIZE.BodyText,
    fontWeight: '700'
  },
  introduce: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.Heading,
    color: CUSTOM_COLOR.GreenBold,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.Large
  },
  wrapper: {
    paddingHorizontal: SPACING.Medium,
    paddingBottom: scale(60),
    marginTop: SPACING.XXLarge
  },
  sttText: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    fontWeight: '700'
  },
  decription: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    marginBottom: SPACING.Large,
    fontWeight: '400',
    textAlign: 'justify'
  },
  noteText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.BodyText,
    textAlign: 'justify'
  },
  label: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  checkBoxIC: {
    marginTop: scale(4)
  },
  textContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.Medium,
    paddingTop: SPACING.Fit
  },
  message: {
    marginStart: SPACING.Normal,
    lineHeight: LINE_HEIGHT.SubHead,
    fontSize: FONT_SIZE.BodyText
  },
  policyContainer: {
    marginBottom: scale(-3)
  },
  policy: {
    lineHeight: LINE_HEIGHT.SubHead,
    fontSize: FONT_SIZE.BodyText,
    textDecorationLine: 'underline'
  },
  checkBoxView: {
    paddingBottom: SPACING.Medium,
    alignItems: 'flex-start',
    backgroundColor: BACKGROUND_COLOR.Primary
  },
  btnContainer: {
    marginHorizontal: SPACING.Medium,
    marginTop: scale(24)
  }
});
