import { StyleSheet } from 'react-native';
import { colors, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainImage: {
    flex: 1,
    marginHorizontal: 14,
    borderRadius: 3
  },
  imageList: {
    width: '100%',
    marginBottom: 0,
    height: 50,
    marginTop: 20
  },
  image: {
    flex: 1,
    borderRadius: 3,

  },
  touchImage: {

    height: 50,
    width: 60,
  },
  normalImage: {
    borderColor: 'gray',
    borderWidth: 1,
  },
  selectedImage: {
    borderColor: '#1B72BF',
    borderWidth: 2,
  },
  itemSeparator: {
    height: '100%',
    width: 10,
  },
  flatlist: {
    paddingLeft: 14
  }

});

export default styles;

