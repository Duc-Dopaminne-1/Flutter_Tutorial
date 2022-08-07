import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { BORDER_RADIUS, DEVICE_HEIGHT, DEVICE_WIDTH, SPACING } from '../constants/size';
import PrimaryButton from './primary_button';
import { BodyText, BoldTitle, CustomWebview, SubHead } from '../components';
import { BACKGROUND_COLOR } from '../constants/colors';
import { scale } from '../utils/responsive';

function PopupPolicy({ type, content, isVisible, style, onClose }) {
  let title = '';
  let subTitleFintecth = '';
  let subTitleTopenGroup = '';
  switch (type) {
    case 'TERMS':
      title = 'legal.terms';
      subTitleFintecth = 'legal.content_terms_topenFintech';
      subTitleTopenGroup = 'legal.content_terms_topenGroup';
      break;

    default:
      title = 'legal.privacy';
      subTitleFintecth = 'legal.content_privacy_topenFintech';
      subTitleTopenGroup = 'legal.content_privacy_topenGroup';
      break;
  }

  const onHandlePress = () => {
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={[styles.modal, style]}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <BoldTitle translate bold style={{ fontSize: scale(24), textAlign: 'center' }}>
            {title}
          </BoldTitle>
          <SubHead translate bold={false}>
            {'legal.content_config'}
          </SubHead>

          <View style={{ marginTop: SPACING.Fit }}>
            <BodyText translate bold>
              {subTitleFintecth}
            </BodyText>
            <CustomWebview content={content?.app} />
          </View>

          <View style={{ marginTop: SPACING.Fit }}>
            <BodyText translate bold>
              {subTitleTopenGroup}
            </BodyText>
            <CustomWebview content={content?.topenId} style={{ padding: 0 }} />
          </View>
        </ScrollView>

        <PrimaryButton translate title={'common.comfirm_policy_sdk'} onPress={onHandlePress} />
      </View>
    </Modal>
  );
}

export default React.memo(PopupPolicy);

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0
  },
  container: {
    padding: SPACING.Medium,
    height: DEVICE_HEIGHT * 0.9,
    width: DEVICE_WIDTH * 0.9,
    backgroundColor: BACKGROUND_COLOR.White,
    borderRadius: BORDER_RADIUS
  }
});
