import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { images, metrics } from '@/vars'
import LinearGradient from 'react-native-linear-gradient'
import axios from 'axios'
import { callAPI, Method } from '@/shared/API'
import { getListRank } from '@/shared/ListAPI'

type Props = {
  navigation?: object
  route?: object
}

export function RankScreen(Props: Props) {
  const { navigation } = Props

  const [data, setData] = useState([])

  function compare(a, b) {
    if (a.scoreID.score < b.scoreID.score) {
      return 1
    }
    if (a.scoreID.score > b.scoreID.score) {
      return -1
    }
    return 0
  }

  useEffect(() => {
    ;(async function getListRanks() {
      const result = await getListRank()
      let data = result.data.filter(data => data)
      data.sort(compare)
      setData(data)
    })()
  }, [])

  function renderItem({ item, index }) {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          backgroundColor: 'white',
          borderWidth: 1,
          marginBottom: 1
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {index === 0 && (
            <Image
              source={images.cup1}
              style={{ height: 30, width: 30, marginRight: 15 }}
            />
          )}
          {index === 1 && (
            <Image
              source={images.cup2}
              style={{ height: 30, width: 30, marginRight: 15 }}
            />
          )}
          {index === 2 && (
            <Image
              source={images.cup3}
              style={{ height: 30, width: 30, marginRight: 15 }}
            />
          )}
          {index > 2 && (
            <View style={{ height: 30, width: 30, marginRight: 15 }} />
          )}
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              width: metrics.screen_width / 2,
              maxHeight: 30,
              marginRight: 5
            }}
            horizontal>
            <Text style={{ color: 'black', fontSize: 16 }}>{item.email} </Text>
          </ScrollView>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text>{item.scoreID.score}</Text>
        </View>
      </View>
    )
  }

  return (
    <ImageBackground source={images.bg1} style={styles.container}>
      <TouchableOpacity
        style={{ zIndex: 999 }}
        onPress={() => {
          Props.navigation.goBack()
        }}>
        <Image
          style={{
            height: 35,
            width: 35,
            backgroundColor: 'black',
            tintColor: 'white',
            borderRadius: 20,
            borderWidth: 1,
            alignSelf: 'flex-end',
            marginBottom: -15,
            marginRight: -10
          }}
          source={images.close1}
        />
      </TouchableOpacity>
      <LinearGradient
        start={{ x: 0, y: 2 }}
        end={{ x: 0, y: 0 }}
        locations={[0, 1]}
        style={styles.container2}
        colors={['#000099', '#00CCFF']}>
        <Text style={styles.title}>BẢNG XẾP HẠNG</Text>

        <FlatList
          keyExtractor={(_item, index) => {
            return _item._id
          }}
          data={data}
          renderItem={renderItem}
        />
      </LinearGradient>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 70
  },
  container2: {
    flex: 1,
    borderRadius: 8,
    paddingTop: 10
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    color: 'yellow',
    fontWeight: '800',
    marginBottom: 30
  }
})
