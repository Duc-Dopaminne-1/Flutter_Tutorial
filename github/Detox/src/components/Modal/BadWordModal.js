import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {CONSTANTS} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {medium, normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import {HTMLText} from '../../screens/ProjectDetail/components/HTMLText';
import {SCREEN_SIZE} from '../../utils/ImageUtil';
import CustomButton from '../Button/CustomButton';
import ModalPopup from './ModalPopup';

const MAX_HEIGHT_SCROLL = 300;
const styles = StyleSheet.create({
  closeButton: {
    ...commonStyles.buttonConfirm,
    height: CONSTANTS.INPUT_HEIGHT,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  container: {
    width: SCREEN_SIZE.WIDTH - 32,
    alignSelf: 'center',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  titleModal: {...FONTS.bold, fontSize: 20, textAlign: 'center'},
});

export const BadWordModal = ({errorKeyword}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (errorKeyword && errorKeyword.length > 0) {
      setShowModal(true);
    }
  }, [errorKeyword]);

  const onDismissPopupError = () => {
    setShowModal(false);
  };

  const customStyle = `b {
    color:red;
    background-color:${COLORS.RED_03};
    font-weight:400;
    padding:1;
    line-height:24px;
  }
  body {
    font-size:15px
  }`;

  return (
    <ModalPopup
      visible={showModal}
      contentContainerStyle={styles.successPopupStyle}
      animationType="slide">
      <View style={styles.container}>
        <Text style={styles.titleModal}>{translate('newPost.badWordTitle')}</Text>
        <ScrollView
          style={{
            height: MAX_HEIGHT_SCROLL,
            marginTop: medium,
            paddingHorizontal: normal,
          }}>
          {errorKeyword.map((item, index) => {
            return (
              <View key={index} style={{marginBottom: normal}}>
                <HTMLText customStyle={customStyle} text={item.highlightedContent} />
              </View>
            );
          })}
        </ScrollView>
        <View style={commonStyles.footerContainer}>
          <CustomButton
            style={styles.closeButton}
            title={translate(STRINGS.CLOSE)}
            titleStyle={commonStyles.confirmText}
            onPress={onDismissPopupError}
          />
        </View>
      </View>
    </ModalPopup>
  );
};

BadWordModal.propTypes = {
  errorKeyword: PropTypes.array,
};

BadWordModal.defaultProps = {
  errorKeyword: [
    {
      originalContent: 'Title CC',
      badWords: ['CC'],
    },
  ],
};
