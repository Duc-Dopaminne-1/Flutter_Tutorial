import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import RequiredLabel from '../../../components/RequiredLabel';
import ScreenIds from '../../ScreenIds';
import FooterButtons from '../NewPost/NewPostComponents/FooterButtons';

const styles = StyleSheet.create({
  viewInside: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: SIZES.BORDER_RADIUS_10,
    ...METRICS.horizontalPadding,
    ...METRICS.paddingTop,
  },
  footerContainer: {
    ...commonStyles.footerContainer,
    marginBottom: normal,
    borderTopWidth: 1,
    borderTopColor: COLORS.SEPARATOR_LINE,
  },
  headerTitle: {
    ...METRICS.marginBottom,
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.BLACK_33,
  },
});

const NewPostAddItem = ({
  onPressDismiss = () => {},
  item,
  disabledConfirm,
  onPressConfirm = () => {},
  children,
  popupTitle,
}) => {
  return (
    <>
      <View style={styles.viewInside} testID={ScreenIds.PostSuccess}>
        <RequiredLabel title={popupTitle} titleStyle={styles.headerTitle} isRequired={false} />
        {children}
      </View>
      <View style={styles.footerContainer}>
        <FooterButtons
          onPressNext={() => {
            onPressConfirm({...item});
          }}
          onPressCancel={onPressDismiss}
          disabledNext={disabledConfirm}
          style={disabledConfirm && {backgroundColor: COLORS.GREY_ED}}
          nextTextStyle={disabledConfirm && {color: COLORS.GRAY_A3}}
          nextButtonTitle={translate(STRINGS.ADD)}
        />
      </View>
    </>
  );
};

NewPostAddItem.propTypes = {
  onPressDismiss: PropTypes.func,
  item: PropTypes.object,
  disabledConfirm: PropTypes.bool,
  onPressConfirm: PropTypes.func,
  onPressErase: PropTypes.func,
  popupTitle: PropTypes.string,
};

NewPostAddItem.defaultProps = {
  onPressDismiss: () => {},
  item: {},
  disabledConfirm: false,
  onPressConfirm: () => {},
  onPressErase: () => {},
  popupTitle: '',
};

export default NewPostAddItem;
