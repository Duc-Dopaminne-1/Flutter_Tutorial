import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable, TouchableWithoutFeedback } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import ShareRedSVG from '@/components/SVG/ShareRedSVG';
import Modal from 'react-native-modal';
import { CustomBidInfoBottomShareModal } from '@/components/CustomBidInfo/CustomBidInfoBottomShareModal';
import { SettingBanner } from '@/screens/Setting/component/SettingBanner';

interface CustomBidInfoBottomProps {
  isFromMyAuction?: boolean;
  dynamicLink?: string;
  contentShare?: string;
  isRaffleAuction?: boolean;
}

export function CustomBidInfoBottomShare(props: CustomBidInfoBottomProps) {
  const { isFromMyAuction, dynamicLink, contentShare, isRaffleAuction } = props;
  const title = useMemo(() => {
    if (isFromMyAuction) {
      return isRaffleAuction ? language('shareMyRaffle') : language('myAuctionsScreen.shareMyAuction');
    } else {
      return isRaffleAuction ? language('shareRaffle') : language('myAuctionsScreen.shareAuction');
    }
  }, [isFromMyAuction]);
  const [isShowModal, setIsShowModal] = useState(false);

  const onPressShare = () => {
    setIsShowModal(true);
  };

  const onPressOut = () => {
    setIsShowModal(false);
  };

  return (
    <View>
      <Pressable onPress={onPressShare} style={styles.wrapShareAuction}>
        <ShareRedSVG />
        <Text style={styles.textShare}>{title}</Text>
      </Pressable>

      <Modal
        isVisible={isShowModal}
        style={styles.modal}
        customBackdrop={
          <TouchableWithoutFeedback onPress={onPressOut}>
            <View style={styles.wrapOutModal} />
          </TouchableWithoutFeedback>
        }
      >
        <SettingBanner />
        <CustomBidInfoBottomShareModal
          key={dynamicLink}
          contentShare={contentShare}
          dynamicLink={dynamicLink}
          title={title}
          onPressOut={onPressOut}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapShareAuction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textShare: {
    fontFamily: fonts.family.RobotoRegular,
    fontSize: fonts.size.s14,
    color: colors.gray_600,
    marginLeft: 5,
  },
  modal: {
    marginHorizontal: 0,
    justifyContent: 'flex-end',
    marginVertical: 0,
  },
  wrapOutModal: {
    flex: 1,
    backgroundColor: colors.gray_900,
  },
});
