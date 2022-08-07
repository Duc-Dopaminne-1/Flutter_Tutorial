import { StyleSheet } from 'react-native';
import { fonts, WIDTH } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const imageSize = 20;
const paddingHorizontal = 16;
const paddingText = 15;
const maxWidthIdText = 50;
const maxWidthName = WIDTH - imageSize - paddingHorizontal * 2 - paddingText * 2 - maxWidthIdText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: Theme.tenant_detail.contentBackground,
    paddingHorizontal: paddingHorizontal,
    paddingTop: 21,
    paddingBottom: 16,
  },
  leftContent: {
    marginRight: 8,
    width: 80,
  },
  rightContent: {
    flex: 1,
  },
  checkShippedButton: {
    height: 30,
    width: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  image: {
    height: imageSize,
    width: imageSize,
    tintColor: Theme.deliveries.done_image,
  },
  nameContainerView: {
    flex: 1,
    alignItems: 'flex-start',
  },
  name: {
    color: Theme.deliveries.name_text,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
  },
  idContainerView: {
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  id: {
    textAlign: 'left',
    color: Theme.deliveries.id_text,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  descriptionView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
  descriptionContainerView: {
    alignItems: 'flex-start',
    flex: 1,
  },
  description: {
    color: Theme.deliveries.description_text,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  dateContainerView: {
    alignItems: 'flex-start',
  },
  date: {
    color: Theme.deliveries.date_text,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  statusDelivery: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusView: {
    height: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
});

export default styles;
