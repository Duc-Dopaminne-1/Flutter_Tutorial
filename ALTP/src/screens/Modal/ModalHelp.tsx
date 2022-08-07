import * as React from 'react'
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
  ImageBackground
} from 'react-native'
import Modal from 'react-native-modal'
import { useEffect, useState } from 'react'
import { showModalHelp } from '@/shared/global'
import { colors, deviceWidth, fonts, images } from '@/vars'
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis
} from 'victory-native'

type Props = {
  navigation?: object
  route?: object
}

const styleBar = {
  data: {
    ...{
      fill: (data: any) => {
        let color = 'red'

        if (data.index === 0) {
          color = 'blue'
        }

        if (data.index === 1) {
          color = 'yellow'
        }
        if (data.index === 2) {
          color = 'red'
        }

        if (data.index === 3) {
          color = 'pink'
        }
        return color
      },
      opacity: 0.9
    }
  }
}

const styleChartY = {
  axis: {
    stroke: '#EBE5E5'
  },
  ticks: {
    stroke: 'transparent'
  },
  tickLabels: {
    color: '#000',
    fill: '#7E7B7B',
    fontSize: 10
  }
}

const styleChartX = {
  axis: {
    stroke: '#EBE5E5'
  },
  ticks: {
    stroke: 'transparent'
  },
  tickLabels: {
    color: '#000',
    fontWeight: '600',
    fill: '#000',
    fontSize: 15
  }
}

export function ModalHelp(Props: Props) {
  const { navigation } = Props
  const data: any = [
    { x: 'A', y: 6 },
    { x: 'B', y: 5 },
    { x: 'C', y: 4 },
    { x: 'D', y: 4 }
  ]
  const [isModalVisible, setModalVisible] = useState(false)
  const [dataChart, setDataChart] = useState(data)

  useEffect(() => {
    showModalHelp.subscribe(items => {
      const result = data.map((item, index) => {
        if (items === index) {
          item.y = 10
        } else {
          item.y = Math.floor(Math.random() * 5)
        }
        return item
      })
      setDataChart(result)
      // console.log('**** showModalHelp', data)
      openModal()
    })
  }, [])
  const openModal = () => {
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  return (
    <Modal
      key={'time'}
      isVisible={isModalVisible}
      hideModalContentWhileAnimating
      useNativeDriver
      style={{ justifyContent: 'center', alignItems: 'center' }}
      customBackdrop={
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.backgroundModal} />
        </TouchableWithoutFeedback>
      }>
      <ImageBackground
        source={images.btnBlue2}
        style={styles.wrapQuestion}
        resizeMode={'stretch'}>
        <Text style={styles.question}>Ý kiến khán giả</Text>

        <VictoryChart
          animate={{
            duration: 1000,
            onLoad: { duration: 350 }
          }}
          theme={VictoryTheme.grayscale}
          domainPadding={{ x: 10 }}
          height={220}
          width={deviceWidth}>
          <VictoryBar
            barWidth={20}
            alignment="middle"
            style={styleBar}
            data={dataChart}
          />

          <VictoryAxis
            dependentAxis
            theme={VictoryTheme.material}
            tickFormat={t => ''}
            style={styleChartY}
            standalone={false}
          />

          <VictoryAxis
            standalone={false}
            tickFormat={t => t}
            style={styleChartX}
          />
        </VictoryChart>
      </ImageBackground>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backgroundModal: {
    flex: 1,
    backgroundColor: '#000000'
  },
  question: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.family.SSPSemiBold,
    fontWeight: '600',
    marginTop: 40
  },
  wrapQuestion: {}
})
