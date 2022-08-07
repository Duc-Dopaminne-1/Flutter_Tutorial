import { StyleSheet, Dimensions } from 'react-native';
import {fonts ,colors } from "../../../constants";


export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 5,
    color: 'white',
    fontSize: 12,
    fontFamily: fonts.family.HNMedium
  },
  modal: {
    justifyContent:'center',
    alignItems:'center'
  }
});