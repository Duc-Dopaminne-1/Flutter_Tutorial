import * as React from 'react'
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { colors, deviceWidth, fonts, images } from '@/vars'
import { AdminHeader } from '@/screens/Admin/component/AdminHeader'

type Props = {
  navigation?: object
  route?: object
}

export function AdminItem(Props: any) {
  const { navigation, onPressItem } = Props

  const onPress = () => {
    onPressItem && onPressItem(Props.item)
    // navigation.navigate('AdminCreateScreen', {isUpdate: true, item: Props.item})
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={images.icons_room_fill} resizeMode={'contain'} />
      <View
        style={{
          height: '100%',
          width: 1,
          backgroundColor: 'yellow',
          marginHorizontal: 10
        }}
      />

      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Text style={styles.text}>- Question : {Props.item.content}</Text>
        <Text style={[styles.text]}>- A : {Props.item.A}</Text>
        <Text style={[styles.text]}>- B : {Props.item.B}</Text>
        <Text style={[styles.text]}>- C : {Props.item.C}</Text>
        <Text style={[styles.text]}>- D : {Props.item.D}</Text>
        <Text style={[styles.text]}>- Answer : {Props.item.answer}</Text>
        <Text style={[styles.text]}>- Level : {Props.item.level}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#0D2643',
    width: deviceWidth - 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'yellow',
    shadowColor: 'yellow',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      width: 1,
      height: 2
    },
    elevation: 2
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.family.SSPSemiBold,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      width: 1,
      height: 2
    },
    elevation: 2
  }
})
