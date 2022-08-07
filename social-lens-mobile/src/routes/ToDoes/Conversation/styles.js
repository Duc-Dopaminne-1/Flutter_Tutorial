import { StyleSheet } from 'react-native';
import {fonts ,colors } from "../../../constants";

export default StyleSheet.create({
  wrapper: {
    flex: 1
  },
  profile: {
    marginBottom: 10
  },
  header: {
    alignSelf: 'stretch',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  icon: {
    width: 30,
    alignItems: 'center',
    marginRight: 10
  },
  title: {
    fontFamily: fonts.family.HNLight,
    fontSize: 20,
    letterSpacing: 1.5,
    color: colors.white
  },
  item: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginBottom: 10
  },
  label: {
    width: 80,
    fontSize: 14,
    color: 'grey'
  },
  value: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500'
  }
});