import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { WIDTH, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    height: 'auto',
  },
  containerEmpty: {
    flex: 1,
    height: 'auto',
  },
  sectionHeader: {
    backgroundColor: 'white',
  },
  swiper: {
    backgroundColor: 'white',
  },
  unactiveDot: {
    backgroundColor: '#f1f1f1',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#1b72bf',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pagination: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 14,
  },
  productItemGrid: {
    flex: 0.5,
    margin: 6,
  },
  columnWrapperStyle: {
  },
  contentContainerStyleGrid: {
    paddingHorizontal: 15
  },
  flatList: {},
  viewEmptyContainer: {
    flex: 1,
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imgEmpty: {
    width: 80,
    height: 100,
  },
  textEmpty: {
    fontSize: 15,
    fontFamily: fonts.MontserratSemiBold,
    textAlign: 'center',
    color: 'grey',
    paddingBottom: 15,
  },
});

export default styles;
