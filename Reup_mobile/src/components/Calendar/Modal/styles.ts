import { StyleSheet } from 'react-native';
import { fonts } from '@constants/vars';
import { Theme } from '@components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.calendar.whiteBackground,
    marginVertical: 100,
    borderRadius: 6,
    paddingVertical: 10
  },
  wrapIconClose: {
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  iconClose: {
    height: 15,
    width: 15
  },
  wrapDate: {
    margin: 15,
  },
  date: {
    fontSize: 13,
    fontFamily: fonts.MontserratSemiBold,
    color: Theme.calendar.modal.title,
  },
  wrapItem: {
    marginBottom: 10
  },
  containerIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 5
  }
});

export default styles;
