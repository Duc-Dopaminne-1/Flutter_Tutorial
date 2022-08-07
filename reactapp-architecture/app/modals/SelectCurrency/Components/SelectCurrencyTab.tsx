import { AButton } from '@/components/AButton/AButton'
import I18n from '@/i18n'
import { Currency } from '@/models/constant'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  value: string
  onPress: () => void
  onSelect: (currency: Currency) => void
}

export const SelectCurrencyTab: React.SFC<Props> = ({
  value,
  onPress,
  onSelect,
}) => {
  const checkCurrentUnit = (key: string) => {
    return value === key
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapTitle}>
        <Text style={styles.title}>{I18n.t('selectCurrency')}</Text>
      </View>

      <View style={styles.wrapRow}>
        <AButton
          title={'USD'}
          onPress={() => {
            onSelect({ symbol: 'USD' } as Currency)
          }}
          containerStyle={[
            styles.button,
            checkCurrentUnit('USD') && {
              backgroundColor: colors.primary_blue,
            },
          ]}
          titleStyle={[
            styles.buttonText,
            checkCurrentUnit('USD') && { color: colors.white },
          ]}
        />

        <AButton
          title={'EUR'}
          onPress={() => {
            onSelect({ symbol: 'EUR' } as Currency)
          }}
          containerStyle={[
            styles.button,
            checkCurrentUnit('EUR') && {
              backgroundColor: colors.primary_blue,
            },
          ]}
          titleStyle={[
            styles.buttonText,
            checkCurrentUnit('EUR') && { color: colors.white },
          ]}
        />
      </View>

      <View style={styles.wrapRow}>
        <AButton
          title={'CNY'}
          onPress={() => {
            onSelect({ symbol: 'CNY' } as Currency)
          }}
          containerStyle={[
            styles.button,
            checkCurrentUnit('CNY') && {
              backgroundColor: colors.primary_blue,
            },
          ]}
          titleStyle={[
            styles.buttonText,
            checkCurrentUnit('CNY') && { color: colors.white },
          ]}
        />

        <AButton
          title={I18n.t('other')}
          onPress={onPress}
          containerStyle={[
            styles.button,
            checkCurrentUnit('OTHER') && {
              backgroundColor: colors.primary_blue,
            },
          ]}
          titleStyle={[
            styles.buttonText,
            checkCurrentUnit('OTHER') && { color: colors.white },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wrapTitle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 37,
  },
  title: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.black_blue_text,
  },
  wrapRow: {
    flexDirection: 'row',
  },
  button: {
    height: 46,
    width: metrics.screen_width / 2.25,
    backgroundColor: colors.pale_grey,
    margin: 3,
  },
  buttonText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.blue_light_grey,
  },
})
