import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { HEIGHT, WIDTH } from '@src/constants/vars';

const paddingHorizontalButton = 20;
const paddingBetweenButton = 24;
const widthButton = (WIDTH - paddingHorizontalButton * 2 - paddingBetweenButton) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    borderBottomColor: Theme.category_details.backgroundColorSectionHeader,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  containerScrollView: {
    flex: 1,
    marginVertical: 7,
    backgroundColor: Theme.new_member.backgroundColorScrollView,
  },
  bottomButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.product.bottomButtonContainerBackgroundColor,
    height: 80,
    marginTop: 6,
  },
  unpublicButton: {
    width: '88%',
    height: 40,
    backgroundColor: Theme.product_detail.backgroundColorUnpublicButton,
  },
  publicButton: {
    width: '88%',
    height: 40,
    backgroundColor: Theme.product_detail.backgroundColorPublicButton,
  },
  textUnpublic: {
    color: Theme.product_detail.textColorLeft,
  },
  textPublic: {
    color: Theme.product_detail.textColorPublic,
  },
  flatListContainer: {
    backgroundColor: Theme.staff.contentBackground,
    height: HEIGHT * 0.3,
  },
  lineContainer: {
    flexDirection: 'row',
  },
  line: {
    width: '100%',
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  inputFormSubContainer: {
    width: '100%',
    marginTop: 12,
  },
  continueShoppingButton: {
    backgroundColor: Theme.product_detail.textColorUnPublicButton,
    paddingHorizontal: 0,
    fontSize: 15,
    width: '100%',
    marginBottom: 20,
  },
});

export default styles;
