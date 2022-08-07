import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {NEW_POST_MODAL_STATE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import CustomFooterButtons from '../../../../components/Button/CustomFooterButtons';
import {NewPostContext} from '../../useNewPost';
import {redirectUserOnCancelPropertyPost} from '../NewPostUtils';
import NewPostAddFacilityModalContainer from './NewPostAddFacilityModalContainer';

const styles = StyleSheet.create({
  separatorRow30: {
    height: 30,
  },
  confirmText: {
    width: '100%',
    ...FONTS.fontSize14,
    ...FONTS.regular,
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 18,
    color: COLORS.BLACK_33,
  },
  modalContainer: {
    width: '100%',
    ...METRICS.horizontalPadding,
    paddingBottom: 40,
  },
  footerButtonsContainer: {
    flexDirection: 'column',
  },
  footerCancelButton: {
    marginStart: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    ...HELPERS.center,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY_A100,
    borderColor: COLORS.PRIMARY_A100,
  },
  footerNextButton: {
    backgroundColor: COLORS.GREY_ED,
  },
  cancelEditText: {
    color: COLORS.NEUTRAL_WHITE,
  },
  nextEditText: {
    color: COLORS.BLACK_33,
  },
});

const NewPostModalContainer = ({
  state,
  dispatch,
  hidePopup = () => {},
  dismissPopup = () => {},
}) => {
  const {resetState} = useContext(NewPostContext);
  switch (state.modalizeState) {
    case NEW_POST_MODAL_STATE.ADD_FURNITURE_FACILITY:
    case NEW_POST_MODAL_STATE.ADD_AREA_FACILITY:
      return (
        <NewPostAddFacilityModalContainer
          title={
            state.modalizeState === NEW_POST_MODAL_STATE.ADD_AREA_FACILITY
              ? translate(STRINGS.NEARBY_FACILITY)
              : translate(STRINGS.FURNITURE_FACILITY)
          }
          searchTextPlaceHolder={translate(STRINGS.SEARCH_FACILITY)}
          state={state}
          dispatch={dispatch}
          hideParentPopup={hidePopup}
        />
      );
    case NEW_POST_MODAL_STATE.CONFIRM_EDIT:
      return (
        <View style={styles.modalContainer}>
          <View style={styles.separatorRow30} />
          <Text style={styles.confirmText}>
            {translate('propertyPost.newPost.confirmCancelUpdatePropertyPost')}
          </Text>
          <View style={styles.separatorRow30} />
          <CustomFooterButtons
            containerStyle={styles.footerButtonsContainer}
            nextButtonStyle={[
              styles.footerCancelButton,
              styles.footerNextButton,
              METRICS.marginTop,
            ]}
            cancelButtonStyle={styles.footerCancelButton}
            cancelTextStyle={styles.cancelEditText}
            nextTextStyle={styles.nextEditText}
            nextButtonTitle={translate(STRINGS.CONFIRM)}
            cancelButtonTitle={translate(STRINGS.CANCEL)}
            onPressCancel={() => {
              dismissPopup();
            }}
            onPressNext={() => {
              dismissPopup();
              resetState();

              redirectUserOnCancelPropertyPost();
            }}
          />
        </View>
      );
  }
};

export default NewPostModalContainer;
