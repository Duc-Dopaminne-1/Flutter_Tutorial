import * as React from 'react'
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { colors, deviceWidth, fonts, images } from '@/vars'

type Props = {
  navigation?: object
  route?: object
}

export function AdminHeader(props: any) {
  const { onBack, isBack, onPressLogout } = props

  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
      }}>
      {isBack ? (
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            marginLeft: 10,
            position: 'absolute',
            left: 10
          }}
          onPress={onBack}>
          <Image
            source={images.back}
            style={{ width: 30, height: 30, tintColor: 'white' }}
          />
        </TouchableOpacity>
      ) : null}

      <Image
        source={images.app}
        style={[
          { width: 50, height: 50, marginLeft: 10, position: 'absolute' },
          isBack ? { right: 10 } : { left: 10 }
        ]}
      />
      <View style={{}}>
        <Text style={styles.text}>{props.title}</Text>
      </View>

      {isBack ? null : (
        <TouchableOpacity
          style={{
            height: 30,
            marginLeft: 10,
            position: 'absolute',
            right: 20,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'yellow',
            paddingHorizontal: 10
          }}
          onPress={onPressLogout}>
          <Text style={styles.textLogout}>Log out</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20
  },
  text: {
    color: colors.white,
    fontSize: 26,
    fontFamily: fonts.family.SSPSemiBold,
    shadowColor: 'black',
    alignSelf: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      width: 1,
      height: 2
    },
    elevation: 2
  },
  textLogout: {
    color: 'yellow',
    fontSize: 18,
    fontFamily: fonts.family.SSPSemiBold,

    alignSelf: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      width: 1,
      height: 2
    },
    elevation: 2
  }
})
