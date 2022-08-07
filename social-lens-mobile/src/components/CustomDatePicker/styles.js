import { StyleSheet, Dimensions } from 'react-native';

let dm = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
    marginHorizontal: 0,
    width: '100%'
  },
  infoTextPlaceholder: {
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 12,
    color: '#c9c9c9'
  },
  infoText: {
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 12,
    color: '#41444b',
  },
  infoInput: {
    width: (dm.width - 65) * 5 / 8,
    height: 40,
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 12,
    color: '#41444b',
    borderWidth: 1,
    borderColor: '#5c41444b',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
  },
  confirmBtnText: {
    fontSize: 16,
    color: "#46cf98",
    fontFamily: 'HelveticaNeue-Light',
  },
  cancelBtnText: {
    fontSize: 16,
    color: "#666",
    fontFamily: 'HelveticaNeue-Light',
  },
  headerPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: 15,
    height: 42
  },
  fullDivider: {
    marginHorizontal: 0,
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: '#d1d1d1'
  },
});