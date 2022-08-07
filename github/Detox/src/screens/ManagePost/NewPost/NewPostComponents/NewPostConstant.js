import {StyleSheet} from 'react-native';

import {CONSTANTS} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {normal, tiny} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';

export const DELETE_ITEM = {
  id: CONSTANTS.UNCHECK_DROPDOWN_ID,
  name: translate('newPost.clearChoicePackage'),
  checked: true,
};

export const plusServiceList = [
  {
    requestTypeId: 'd98ade1b-a88c-405a-a538-37325213419c',
    requestTypeName: 'ConsultCost',
    requestTypeDescription: translate('newPost.plusServices.ConsultCost'),
    isDisplayHomepage: true,
    sortOrder: 1,
  },
  {
    requestTypeId: 'b620ba0d-149a-4846-a5ba-b7835f088bdf',
    requestTypeName: 'ConsultLegal',
    requestTypeDescription: translate('newPost.plusServices.ConsultLegal'),
    isDisplayHomepage: true,
    sortOrder: 2,
  },
  {
    requestTypeId: '3d610763-6890-45db-9d30-eb45a532a1e9',
    requestTypeName: 'Notarization',
    requestTypeDescription: translate('newPost.plusServices.Notarization'),
    isDisplayHomepage: true,
    sortOrder: 3,
  },
  {
    // https://dev.azure.com/topenlandtech/ht-topenland/_git/mobile-app/commit/0da5ac73c65f0ffcc369d258a9ebb5bc6af43b80
    requestTypeId: 'fb020586-5333-41eb-8e02-0e0cfe45df72',
    requestTypeName: 'ConsultProcedure',
    requestTypeDescription: translate('newPost.plusServices.ConsultProcedure'),
    isDisplayHomepage: true,
    sortOrder: 4,
  },
  {
    requestTypeId: 'b09d47c9-91ac-48ea-9b11-66905e9d1622',
    requestTypeName: 'ConsultFinance',
    requestTypeDescription: translate('newPost.plusServices.ConsultFinance'),
    isDisplayHomepage: true,
    sortOrder: 5,
  },
];

export const NewPostStyles = StyleSheet.create({
  textInput: {
    borderRadius: CONSTANTS.INPUT_BORDER_RADIUS,
    marginTop: 12,
  },
  dropdown: {
    marginTop: tiny,
  },
  label: {
    marginTop: normal,
  },
  dropdownPlaceholder: {
    ...commonStyles.placeholderText16,
  },
  inputLocation: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
  },
  activeInputContainer: {
    ...commonStyles.inputBorderWithIcon,
    borderColor: COLORS.PRIMARY_A100,
  },
  itemSuggestion: {
    ...HELPERS.rowSpaceBetweenCenter,
    ...commonStyles.inputBorderStyle,
    marginTop: 0,
    borderWidth: 0,
  },
  suggestionContainer: {
    ...commonStyles.shadowApp,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    width: '100%',
    borderRadius: CONSTANTS.INPUT_BORDER_RADIUS,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_E4,
    overflow: 'hidden',
    marginTop: 0,
  },
  headerTitle: {
    fontSize: SIZES.FONT_24,
    ...FONTS.bold,
    color: COLORS.BLACK_33,
  },
  backGrayNonBorder: {
    backgroundColor: COLORS.TEXT_GRAY_50,
    borderWidth: 0,
  },
  borderTopWidth: {
    borderTopWidth: 1,
    borderColor: COLORS.GREY_F0,
  },
  viewWithIndex: {
    zIndex: 100,
  },
});
