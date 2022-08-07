import React, {useEffect} from 'react';
import {Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {getStaticPageUrl} from '../../api/userApi/staticPagesApi';
import {SIZES} from '../../assets/constants/sizes';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal, small} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import CustomButton from '../../components/Button/CustomButton';
import PageScreen from '../../components/PageScreen';
import {SizeBox} from '../../components/SizeBox';
import usePlusServices from '../../hooks/usePlusServices';
import {callAfterInteraction} from '../commonHooks';
import PlusServiceBlock from '../Home/components/PlusServiceBlock';
import {useTPFClient} from '../TPF/hooks/useTPFClient';
import {PlusServiceViewProps} from './types';

export const openServiceDetail = item => {
  const url = getStaticPageUrl({
    objectType: 'PlusServices',
    pageType: item.typeId,
  });
  Linking.openURL(url);
};

const PlusServiceScreen = ({route}) => {
  const createServicesQuickly = route?.params?.createServicesQuickly ?? false;
  const props = usePlusServices();
  const tpfClient = useTPFClient();

  useEffect(() => {
    if (createServicesQuickly) {
      callAfterInteraction(() => {
        tpfClient.showCreateRequest();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createServicesQuickly]);

  return (
    <PageScreen showHeaderShadow title={translate('plusService.title')}>
      <PlusServiceView {...props} onPressCreateRequest={tpfClient.showCreateRequest} />
    </PageScreen>
  );
};

export const PlusServiceView = ({
  onLoginPress,
  onPressItem,
  onPressCreateRequest,
  plusServices,
}: PlusServiceViewProps) => {
  return (
    <>
      <View style={styles.banner}>
        <Text style={styles.topenerDescription}>{translate('plusService.tpf.description')}</Text>
        <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
          <Text style={styles.loginButtonTitle}>{translate('plusService.tpf.login')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentView}>
        <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
          <SizeBox height={SIZES.SEPARATOR_12} />
          <PlusServiceBlock onPressServiceItem={onPressItem} plusServices={plusServices} />
        </ScrollView>
      </View>
      <View style={commonStyles.footerContainer}>
        <CustomButton
          style={styles.createRequestButton}
          title={translate('plusService.tpf.createRequest')}
          onPress={onPressCreateRequest}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    paddingVertical: normal,
    paddingHorizontal: normal,
    backgroundColor: COLORS.PRIMARY_A20,
  },
  topenerDescription: {
    ...FONTS.regular,
    flex: 1,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_DARK_10,
  },
  loginButton: {
    backgroundColor: COLORS.PRIMARY_A100,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: small,
    marginLeft: small,
  },
  loginButtonTitle: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_14,
    color: COLORS.NEUTRAL_WHITE,
    textAlign: 'center',
  },
  createRequestButton: {
    ...commonStyles.buttonNext,
    ...HELPERS.fill,
  },
  contentView: {backgroundColor: COLORS.NEUTRAL_BACKGROUND, flex: 1},
});

export default React.memo(PlusServiceScreen);
