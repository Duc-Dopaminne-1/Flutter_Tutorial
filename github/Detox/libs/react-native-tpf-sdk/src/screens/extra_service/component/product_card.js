import { useNavigation } from '@react-navigation/native';
import { ICNewProduct } from '../../../assets/images';
import { BodyText, SmallText, SubHead } from '../../../components/';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, BUTTON_COLOR, TEXT_COLOR } from '../../../constants/colors';
import SCREENS_NAME from '../../../constants/screens';
import { BORDER_RADIUS, MULTIE_BORDER_RADIUS, SPACING } from '../../../constants/size';
import { Shadow } from '../../../constants/stylesCSS';
import { handleTouchItem } from '../../../helpers/handleTouchItem';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';
import themeContext from '../../../constants/theme/themeContext';

const ProductCard = ({ item, route }) => {
  const navigation = useNavigation();
  const { topenId } = useSelector(state => state.auth);
  const theme = useContext(themeContext);
  const onPress = event => {
    handleTouchItem(event, 'ExtraServiceItem', route, item, topenId);
    navigation.navigate(SCREENS_NAME.EXTRA_SERVICE_DETAIL_SCREEN, { item });
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.imageWrapper}>
        {item.statusNew ? (
          <View style={styles.isNewWrapper}>
            <FastImage style={styles.iconNew} source={ICNewProduct} />
            <SmallText translate style={[styles.textNew, { fontFamily: theme?.fonts?.BOLD }]}>
              {'added_service.new'}
            </SmallText>
          </View>
        ) : null}

        <FastImage source={{ uri: item.image }} style={styles.image} />
      </View>
      <View style={styles.contenWrapper}>
        <BodyText style={{ fontFamily: theme?.fonts?.SEMIBOLD }}>{item.name}</BodyText>
        <View style={styles.description}>
          <SubHead numberOfLines={2}>{item.shortDescription}</SubHead>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.White,
    borderRadius: MULTIE_BORDER_RADIUS.NORMAL,
    marginBottom: SPACING.Medium
  },
  logoWrapper: {
    zIndex: 10,
    position: 'absolute',
    marginLeft: scale(8),
    width: scale(48, false),
    height: scale(48, false),
    bottom: scale(12)
  },
  isNewWrapper: {
    zIndex: 10,
    position: 'absolute',
    top: scale(12),
    right: scale(-4)
  },
  textNew: {
    color: TEXT_COLOR.White,
    zIndex: 10,
    position: 'absolute',
    top: scale(5),
    right: scale(8)
  },
  iconNew: {
    width: scale(48),
    height: scale(28)
  },
  imagePartner: {
    flex: 1,
    borderRadius: BORDER_RADIUS
  },
  imageWrapper: {
    height: scale(140),
    borderTopLeftRadius: MULTIE_BORDER_RADIUS.NORMAL,
    borderTopRightRadius: MULTIE_BORDER_RADIUS.NORMAL
  },
  image: {
    height: scale(140),
    width: '100%',
    borderTopLeftRadius: MULTIE_BORDER_RADIUS.NORMAL,
    borderTopRightRadius: MULTIE_BORDER_RADIUS.NORMAL
  },
  contenWrapper: {
    padding: SPACING.XNormal,
    paddingTop: SPACING.Medium
  },
  description: {
    marginTop: SPACING.Normal
  },
  descriptionText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.TITLE
  },
  status: {
    zIndex: 9,
    width: scale(80),
    right: scale(12),
    position: 'absolute',
    alignItems: 'center',
    top: scale(16, false),
    height: scale(25, false),
    justifyContent: 'center',
    backgroundColor: BUTTON_COLOR.Primary,
    borderRadius: MULTIE_BORDER_RADIUS.NORMAL
  },
  statusText: {
    color: TEXT_COLOR.White,
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.HEADER
  }
});
