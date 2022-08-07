import { colors, deviceWidth, fonts } from '@/vars';
import { s, vs } from '@/vars/scaling';
import { StyleSheet } from 'react-native';
import { isIOS } from '@/shared/devices';

export default StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    paddingHorizontal: s(15),
  },
  wrapIconSchool: {
    marginTop: 3,
  },
  fullHeight: {
    flex: 1,
  },
  icon: {
    height: vs(16),
    width: vs(16),
  },
  wrapIconLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 99,
    transform: [{ rotate: '-90 deg' }],
  },
  wrapIconRight: {
    position: 'absolute',
    bottom: -4,
    right: 0,
    zIndex: 99,
    transform: [{ rotate: '90 deg' }],
  },
  container: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 0,
    borderRadius: 12,
  },
  imageWrapper: {
    width: '100%',
    backgroundColor: colors.white,
    height: vs(200),
    borderRadius: 12,
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    width: '100%',
    left: 0,
    right: 0,
    height: deviceWidth - s(15 * 2),
    borderRadius: 12,
    overflow: null,
  },
  imageThumbnail: {
    bottom: 0,
    height: undefined,
  },
  wrapImage: {
    borderRadius: 12,
  },
  metaInfo: {
    position: 'absolute',
    bottom: vs(10),
    left: 10,
    right: 10,
  },
  nameWrapper: {
    paddingTop: 0,
  },
  wrapTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(15),
    marginLeft: vs(10),
    marginRight: vs(15),
  },
  nameContainer: {
    marginTop: vs(4),
  },
  nameText: {
    color: colors.white,
  },
  detailWrapper: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  textInfo: {
    fontSize: fonts.size.s14,
    color: colors.gray_500,
  },
  wrapMeet: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg_gray_virtual,
    paddingVertical: vs(5),
    paddingHorizontal: s(10),
    borderRadius: 3,
  },
  wrapIcon: {
    marginRight: 4,
  },
  iconMeet: {
    height: vs(17),
    width: vs(17),
    marginRight: s(5),
  },
  textMeet: {
    fontSize: fonts.size.s13,
    lineHeight: fonts.size.s18,
    color: colors.red_700,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: '500',
  },
  wrapAuction: {
    alignSelf: 'flex-start',
    backgroundColor: colors.red_700,
    marginLeft: 2,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: 4,
  },
  textAuction: {
    color: colors.white,
    fontSize: fonts.size.s13,
    lineHeight: fonts.size.s18,
  },
  metaItem: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    marginTop: vs(3),
  },
  metaText: {
    marginLeft: s(7),
    fontSize: fonts.size.s14,
    color: colors.gray_700,
    flexShrink: 1,
    fontFamily: fonts.family.RobotoRegular,
  },
  detailTop: {
    marginTop: vs(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailTopItem: {
    marginBottom: vs(3),
  },
  detailTopText: {
    marginLeft: 5,
    color: colors.gray_500,
    fontSize: fonts.size.s12,
    fontFamily: fonts.family.RobotoRegular,
  },
  detailTopSpacing: {
    marginBottom: vs(20),
  },
  detailContent: {
    paddingTop: vs(4),
    alignItems: 'flex-start',
  },
  detailContentEmpty: {
    marginBottom: vs(26),
  },
  detailContentItem: {
    marginBottom: vs(2),
  },
  detailContentItemContainer: {
    alignSelf: 'flex-start',
  },
  detailContentTitle: {
    fontSize: fonts.size.s13,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsSemiBold,
  },
  detailContentText: {
    fontSize: fonts.size.s14,
    height: isIOS ? fonts.size.s33 : fonts.size.s36,
    color: colors.white,
    fontFamily: fonts.family.RobotoRegular,
  },
  detailTagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'baseline',
  },
  detailTagItem: {
    height: vs(26),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(8),
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.gray_400,
    alignSelf: 'flex-start',
    marginRight: s(8),
    marginBottom: vs(4),
  },
  detailTagText: {
    color: colors.gray_600,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.RobotoRegular,
  },
  galleryWrapper: {
    marginTop: vs(10),
  },
  galleryPhoto: {
    height: vs(300),
    resizeMode: 'cover',
    backgroundColor: colors.bg_blue_light,
    marginBottom: 1,
  },
  loadingView: {
    alignSelf: 'center',
    marginVertical: vs(10),
  },
  instagramWrapper: {
    marginVertical: vs(20),
    alignItems: 'flex-start',
  },
  instagramUsername: {
    marginLeft: 6,
    color: colors.red_700,
    fontSize: fonts.size.s16,
  },
  instagramIcon: {
    width: vs(24),
    height: vs(24),
  },
  wrapAuctionBadge: {
    position: 'absolute',
    right: -8 + 15,
    zIndex: 1,
  },
  auctionBadgeContainer: {
    alignItems: 'flex-end',
  },
  wrapDot: {
    backgroundColor: colors.transparent,
    zIndex: 8,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: colors.blue_gray,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    marginBottom: -6,
  },
  linear: {
    width: 8,
    height: 5,
    zIndex: 2,
    marginBottom: -1,
  },
  wrapTime: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 0,
    paddingHorizontal: s(16),
    height: vs(44),
  },

  btnRevert: {
    position: 'absolute',
    top: 15,
    left: 30,
    zIndex: 1,
    shadowColor: colors.blue_700,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
    width: vs(40),
    height: vs(40),
  },
  revertIcon: {
    width: vs(24),
    height: vs(24),
  },
  detailAuctionWrapper: {
    flex: 1,
    flexGrow: 1,
    marginBottom: vs(10),
  },
  auctionButtonWrapper: {
    marginTop: vs(30),
    marginBottom: vs(30),
  },
  buttonSpacing: {
    height: vs(80),
  },
  hidden: {
    opacity: 0,
  },
});
