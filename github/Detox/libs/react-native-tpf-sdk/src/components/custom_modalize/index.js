import React, { useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import themeContext from '../../constants/theme/themeContext';
import { PrimaryButton } from '..';
import AppText from '../../components/app_text';
import RowSpace from '../../components/row_space';
import { BACKGROUND_COLOR, COLOR_BACKGROUND } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/size';
import styles from './styles';

const CustomModalize = props => {
  const modal = useRef();
  const { fonts } = useContext(themeContext) || {};

  const {
    title,
    visibleModal,
    icon,
    whiteTitle,
    blackTitle,
    description,
    onClosed,
    translateTitle = false,
    translateDescription = false,
    translateBlackTitle = false,
    translateWhiteTitle = false
  } = props;

  useEffect(() => {
    if (visibleModal) {
      setTimeout(() => onOpen(), 300);
    }
  }, [visibleModal]);

  const onOpen = () => {
    modal.current?.open();
  };

  const onClose = () => {
    modal.current?.close();
  };

  const onWhitePressButton = () => {
    const { onWhiteButtonClick } = props;
    onClose();
    onWhiteButtonClick && setTimeout(() => onWhiteButtonClick(), 200);
  };

  const onBlackPressButton = () => {
    const { onBlackButtonClick } = props;
    onClose();
    onBlackButtonClick && setTimeout(() => onBlackButtonClick(), 200);
  };

  return (
    <Modalize
      ref={modal}
      withReactModal
      scrollViewProps={{ scrollEnabled: false }}
      childrenStyle={{
        backgroundColor: COLOR_BACKGROUND,
        borderRadius: BORDER_RADIUS
      }}
      adjustToContentHeight
      withHandle={false}
      onClosed={visibleModal && onClosed}>
      <View style={[styles.container]}>
        <View style={styles.subContainer}>
          {icon}
          <View style={{ marginTop: SPACING.Medium }}>
            {title ? (
              <AppText
                translate={translateTitle}
                style={[styles.titleText, { fontFamily: fonts?.BLACK }]}>
                {title}
              </AppText>
            ) : null}
            {description ? (
              <AppText translate={translateDescription} style={styles.descriptionText}>
                {description}
              </AppText>
            ) : null}
          </View>
        </View>
        {whiteTitle || blackTitle ? (
          <View style={styles.actionContainer}>
            {blackTitle ? (
              <PrimaryButton
                translate={translateBlackTitle}
                title={blackTitle}
                onPress={onBlackPressButton}
              />
            ) : null}
            <RowSpace />
            {whiteTitle ? (
              <PrimaryButton
                translate={translateWhiteTitle}
                title={whiteTitle}
                backgroundColor={BACKGROUND_COLOR.Secondary}
                titleStyle={styles.whiteTitle}
                onPress={onWhitePressButton}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </Modalize>
  );
};

export default React.memo(CustomModalize);
