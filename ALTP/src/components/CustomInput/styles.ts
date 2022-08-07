import { StyleSheet } from 'react-native'
import { deviceWidth, fonts } from '@/vars'

const styles = StyleSheet.create({
  formBar: {
    backgroundColor: 'white',
    height: 35,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 2,
    borderColor: 'rgba(219,219,219,0.8)',
    borderWidth: 1
  },
  inputStyle: {
    fontSize: 13,
    fontFamily: fonts.family.SSPBold,
    color: '#333333'
  },
  inputContainer: {
    borderBottomWidth: 0
  },
  wrapper: {
    alignItems: 'flex-start'
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 0,
    width: deviceWidth - 30
  },
  image: {
    width: 18,
    height: 18
  },
  description: {
    fontSize: 16,
    color: 'white',
    fontFamily: fonts.family.SSPBold,
    marginBottom: 15
  }
})

export default styles
