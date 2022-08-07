import React, {useImperativeHandle, useRef} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';

import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal} from '../../../assets/theme/metric';
import Avatar from '../../../components/Avatar';
import CustomButton from '../../../components/Button/CustomButton';
import LinkTextButton from '../../../components/LinkTextButton';
import {getUserFullName} from '../../../utils/UserAgentUtil';

type ShareApplicationProps = {
  userInviteInfo: any,
  userData: any,
  onViewListMemberInvited: () => void,
  onShareLink: () => void,
  onCopyCode: () => void,
  onShareQrCode: () => void,
};

type QRCodeGenerationProps = {
  code: String,
  onPressShare: () => void,
};

type ButtonCopyCodeProps = {
  title: String,
  buttonName: String,
  code: String,
  pressCopyCode: () => void,
};

type NumberMemberInviteProps = {
  totalInviteActive: String,
  onViewListMemberInvited: () => void,
};

type ShareSnapshotQrCodeProps = {
  userData: any,
  userInviteInfo: any,
  onShareQrCode: () => void,
};

const AVATAR_SIZE = 40;

const QRCodeGeneration = ({code, onPressShare}: QRCodeGenerationProps) => {
  return (
    <View style={styles.viewQRCodeContainer}>
      <Text style={styles.qrCodeTitle}>{translate('shareScreen.qrCodeTitle')}</Text>
      <View style={styles.wrapQRCode}>
        <QRCode value={code} size={201} />
      </View>
      <Text style={styles.qrCodeDesciption}>{translate('shareScreen.qrCodeDescription')}</Text>
      <CustomButton
        style={styles.btnShareQrCode}
        titleStyle={styles.btnCopyCodeTitle}
        onPress={onPressShare}
        title={translate('shareScreen.btnShareQrCode')}
      />
    </View>
  );
};

const ButtonCopyCode = ({title, buttonName, code, pressCopyCode}: ButtonCopyCodeProps) => {
  return (
    <View style={METRICS.mediumMarginTop}>
      <Text style={styles.labelInfo}>{title}</Text>
      <View style={styles.viewCode}>
        <View style={[HELPERS.fillColMain, METRICS.padding, METRICS.normalMarginEnd]}>
          <Text numberOfLines={1} style={styles.descriptionInfo}>
            {code}
          </Text>
        </View>
        <CustomButton
          style={styles.btnCopyCode}
          titleStyle={styles.btnCopyCodeTitle}
          onPress={pressCopyCode}
          title={buttonName}
        />
      </View>
    </View>
  );
};

const NumberMemberInvite = ({
  totalInviteActive = '0',
  onViewListMemberInvited,
}: NumberMemberInviteProps) => {
  return (
    <View style={HELPERS.row}>
      <Image source={IMAGES.IC_REFERENCE_FILL} />
      <View style={styles.marginTextNumberShare}>
        <Text style={[styles.descriptionInfo, HELPERS.flexShrink]}>
          {translate('shareScreen.friendsJoinedTopenlandDescription', {
            value: totalInviteActive,
          })}
        </Text>
        <LinkTextButton
          onPress={onViewListMemberInvited}
          title={translate('shareScreen.btnMemberInvited')}
          textStyle={{color: COLORS.PRIMARY_A100}}
        />
      </View>
    </View>
  );
};

const ShareSnapshotQrCode = React.forwardRef(
  ({userData, userInviteInfo, onShareQrCode}: ShareSnapshotQrCodeProps, currentRef) => {
    const ref = useRef();
    const fullname = getUserFullName(userData);
    const avatar = userData?.profilePhoto;

    const shareQrCode = () => {
      ref.current.capture().then(uri => {
        onShareQrCode(uri);
      });
    };

    useImperativeHandle(currentRef, () => {
      return {shareQrCode};
    });

    return (
      <ViewShot ref={ref} style={styles.snapshotContainer}>
        <Avatar name={''} size={AVATAR_SIZE} url={avatar} />
        <Text style={styles.snapshotName}>{fullname}</Text>
        <View style={styles.snapshotWrapQRCode}>
          <QRCode value={userInviteInfo?.inviteLink} size={200} />
          <Text style={styles.snapshotQrCodeDesciption}>
            {translate('shareScreen.shareQrCodeContent')}
          </Text>
        </View>
        <Image
          style={styles.snapshotLogo}
          source={IMAGES.IMG_LOGO_TOPENLAND}
          resizeMode="contain"
        />
      </ViewShot>
    );
  },
);

const LineEnd = () => {
  return <View style={styles.line} />;
};

const ShareApplicationView = ({
  userInviteInfo,
  userData,
  onViewListMemberInvited,
  onShareLink,
  onCopyCode,
  onShareQrCode,
}: ShareApplicationProps) => {
  const snapshotRef = useRef();

  const onPressShareQrCode = () => {
    snapshotRef?.current?.shareQrCode();
  };

  return (
    <View style={METRICS.padding}>
      <QRCodeGeneration code={userInviteInfo?.inviteLink} onPressShare={onPressShareQrCode} />
      <ShareSnapshotQrCode
        ref={snapshotRef}
        userData={userData}
        userInviteInfo={userInviteInfo}
        onShareQrCode={onShareQrCode}
      />
      <ButtonCopyCode
        pressCopyCode={onShareLink}
        title={translate('shareScreen.titleShareLink')}
        buttonName={translate('shareScreen.shareButton')}
        code={userInviteInfo?.inviteLink}
      />
      <ButtonCopyCode
        pressCopyCode={onCopyCode}
        title={translate('shareScreen.titleShareCode')}
        buttonName={translate('shareScreen.btnCopyCode')}
        code={userInviteInfo?.inviteCode}
      />
      <LineEnd />
      <NumberMemberInvite
        totalInviteActive={userInviteInfo?.totalInviteActive}
        onViewListMemberInvited={onViewListMemberInvited}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  labelInfo: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.BLACK_33,
    fontWeight: '700',
  },
  descriptionInfo: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.BLACK_33,
  },
  viewCode: {
    flexDirection: 'row',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    marginTop: normal,
    borderColor: COLORS.GRAY_C9,
    borderRadius: SIZES.BORDER_WIDTH_6,
  },
  btnCopyCode: {
    borderRadius: SIZES.BORDER_WIDTH_6,
    paddingHorizontal: SIZES.PADDING_12,
    justifyContent: 'flex-end',
  },
  btnCopyCodeTitle: {
    color: COLORS.PRIMARY_A100,
    fontSize: SIZES.FONT_14,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: COLORS.GREY_E4,
    ...METRICS.mediumVerticalMargin,
  },
  marginTextNumberShare: {
    ...METRICS.marginStart,
    flexWrap: 'wrap',
  },
  viewQRCodeContainer: {
    zIndex: 999,
    backgroundColor: COLORS.PRIMARY_A10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: SIZES.BORDER_WIDTH_8,
    padding: SIZES.PADDING_16,
  },
  wrapQRCode: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.PADDING_12,
    width: 227,
    height: 227,
    borderRadius: SIZES.BORDER_WIDTH_8,
    margin: SIZES.MARGIN_16,
  },
  qrCodeTitle: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_20,
    color: COLORS.TEXT_DARK_10,
  },
  qrCodeDesciption: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.TEXT_DARK_10,
    fontWeight: '400',
  },
  btnShareQrCode: {
    borderRadius: SIZES.BORDER_WIDTH_6,
    paddingHorizontal: SIZES.PADDING_12,
    justifyContent: 'flex-end',
    borderColor: COLORS.PRIMARY_A100,
    borderWidth: SIZES.BORDER_WIDTH_1,
    height: SIZES.HEIGHT_BUTTON_32,
    marginTop: SIZES.MARGIN_16,
  },
  snapshotContainer: {
    position: 'absolute',
    zIndex: 1,
    width: 300,
    height: 400,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: SIZES.BORDER_WIDTH_8,
    paddingTop: SIZES.PADDING_16,
    paddingBottom: SIZES.PADDING_8,
    paddingHorizontal: SIZES.PADDING_8,
  },
  snapshotName: {...FONTS.bold, fontSize: SIZES.FONT_16, marginTop: SIZES.MARGIN_8},
  snapshotWrapQRCode: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapshotQrCodeDesciption: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_DARK_40,
    marginTop: SIZES.MARGIN_8,
  },
  snapshotLogo: {
    width: 94,
  },
});

export default ShareApplicationView;
