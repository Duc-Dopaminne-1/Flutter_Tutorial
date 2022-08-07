import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({

  sectionHeader: {
    borderBottomColor: Theme.category_details.backgroundColorSectionHeader,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader
  },
  viewPopup: {
    backgroundColor: Theme.apartments.backgroundColorSectionHeader,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 2,
    borderColor: Theme.apartments.border,
    padding: 12
  },
  imagePopup: {
    width: 50,
    height: 50,
    marginBottom: 20
  },
  titleTextPopup: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.product_detail.textColorLeft,
    paddingBottom: 20
  },
  thankyouTextPopup: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    color: Theme.product_detail.textColorRight,
    lineHeight: 24,
    textAlign: 'center',
    paddingBottom: 20
  },

  textClose: {
    fontSize: 12,
    fontFamily: fonts.MontserratMedium,
    lineHeight: 15,
    color: Theme.apartments.text
  },
  closeContainer: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    alignSelf: 'flex-end'
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: Theme.product_detail.backgroundColorModal,
  },
  continueShoppingButton: {
    backgroundColor: Theme.product_detail.textColorUnPublicButton,
    paddingHorizontal: 0,
    fontSize: 15,
    width: '100%',
    marginBottom: 20
  },
});

export default styles;
