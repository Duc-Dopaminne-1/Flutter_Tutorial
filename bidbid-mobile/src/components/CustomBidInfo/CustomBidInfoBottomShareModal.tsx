import React, { ReactElement } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import CustomHeader from '@/components/CustomHeader';
import CloseSvg from '@/components/SVG/CloseSVG';
import { CustomLine } from '@/components/CustomeLine';
import { isIOS } from '@/shared/devices';
import FacebookShareSVG from '@/components/SVG/FacebookShareSVG';
import TwitterShareSVG from '@/components/SVG/TwitterShareSVG';
import Share from 'react-native-share';
import ShareLinkRedSVG from '@/components/SVG/ShareLinkRedSVG';
import LinkWhiteSVG from '@/components/SVG/LinkWhiteSVG';
import Clipboard from '@react-native-clipboard/clipboard';
import { SettingBanner } from '@/screens/Setting/component/SettingBanner';
import { shareContact } from '@/shared/global';

interface CustomBidInfoBottomProps {
  onPressOut?: () => void;
  title: string;
  contentShare?: string;
  dynamicLink?: string;
}

interface ShareSocial {
  title: string;
  children: any;
  shouldShowBottomLine: boolean;
  onPress: () => void;
  isShareLink?: boolean;
}

export function CustomBidInfoBottomShareModal(props: CustomBidInfoBottomProps) {
  const { onPressOut, title, dynamicLink, contentShare } = props;

  const onPressFacebook = async () => {
    onPressOut();
    setTimeout(async () => {
      await Share.shareSingle({
        url: dynamicLink,
        social: Share.Social.FACEBOOK,
      });
    }, 400);
  };

  const onPressTwitter = async () => {
    const text = contentShare.replace(/& /g, '');
    onPressOut();
    await Share.shareSingle({
      social: Share.Social.TWITTER,
      message: text,
      url: dynamicLink,
    });
  };

  const onPressShareLink = async () => {
    shareContact.next({ title: language('linkCopied') });
    Clipboard.setString(dynamicLink);
  };

  const data: ShareSocial[] = [
    { title: language('facebook'), children: <FacebookShareSVG />, onPress: onPressFacebook, shouldShowBottomLine: true },
    { title: language('twitter'), children: <TwitterShareSVG />, onPress: onPressTwitter, shouldShowBottomLine: true },
    {
      title: language('shareLink'),
      children: <ShareLinkRedSVG />,
      onPress: onPressShareLink,
      shouldShowBottomLine: false,
      isShareLink: true,
    },
  ];

  const renderLink = (onPress: () => void) => {
    return (
      <View style={styles.wrapItemLink}>
        <View style={styles.wrapLink}>
          <Text numberOfLines={1} style={styles.textLink}>
            {dynamicLink}
          </Text>
        </View>

        <Pressable style={styles.wrapCopy} onPress={onPress}>
          <LinkWhiteSVG />
          <Text style={styles.textCopy}>{language('copy')}</Text>
        </Pressable>
      </View>
    );
  };

  const RenderItemSocial = (data: ShareSocial) => {
    const { title, children, shouldShowBottomLine, onPress, isShareLink } = data;

    return (
      <Pressable key={title} onPress={onPress} style={styles.wrapRow}>
        <View style={styles.wrapItem}>
          <View style={styles.wrapIcon}>{children}</View>

          <View style={styles.wrapTextSocial}>
            <Text style={styles.textSocial}>{title}</Text>
          </View>
        </View>
        {isShareLink && renderLink(onPress)}
        {shouldShowBottomLine && <CustomLine />}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        rightIcon={<CloseSvg />}
        onPressSubIcon={onPressOut}
        wrapIconStyle={styles.wrapIconClose}
        titleStyle={styles.title}
        containerStyle={styles.containerStyle}
        title={title}
      />
      <CustomLine />

      {data.map(item => RenderItemSocial(item))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 40,
  },
  containerStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
    backgroundColor: colors.transparent,
  },
  wrapIconClose: {
    position: 'absolute',
    right: 0,
    paddingVertical: 0,
    marginRight: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_900,
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: fonts.size.s18,
  },
  textSocial: {
    fontFamily: fonts.family.RobotoRegular,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    paddingVertical: 20,
  },
  wrapItem: {
    flexDirection: 'row',
  },
  wrapRow: {
    paddingLeft: 20,
    marginRight: 15,
  },
  wrapIcon: {
    justifyContent: 'center',
  },
  wrapTextSocial: {
    flex: 1,
    marginLeft: 10,
  },
  wrapItemLink: {
    flexDirection: 'row',
  },
  wrapLink: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray_500,
    paddingVertical: 10,
    paddingLeft: 10,
  },
  textLink: {
    color: colors.gray_500,
    fontFamily: fonts.family.RobotoRegular,
    fontSize: fonts.size.s14,
    fontWeight: '400',
  },
  wrapCopy: {
    flexDirection: 'row',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue_700,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  textCopy: {
    marginLeft: 5,
    color: colors.white,
    fontFamily: fonts.family.RobotoRegular,
    fontSize: fonts.size.s14,
    fontWeight: '400',
  },
});
