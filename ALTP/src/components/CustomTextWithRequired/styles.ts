import { StyleSheet } from 'react-native'
import { fonts } from '@/vars'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    fontFamily: fonts.family.SSPBold,
    color: '#707070'
  },
  textRequired: {
    fontSize: 8,
    color: '#1b72bf',
    alignSelf: 'flex-start',
    fontFamily: fonts.family.SSPBold,
    marginLeft: 4
  }
})

export default styles
