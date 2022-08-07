import { ATitle } from '@/components/ATitle/ATitle'
import { AViewMoreText } from '@/components/AViewMoreText/AViewMoreText'
import I18n from '@/i18n'
import { fonts, metrics } from '@/vars'
import { colors } from '@/vars/colors'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { withContext } from '@/shared/withContext'
import { GlobalSupplierInfoContext } from '@/screens/GlobalSupplierInfo/GlobalSupplierInfoContext'
import { Booth } from '@/models/global'
import { SafeBooth } from '@/shared/booth'
import { SafeGlobalSupplier } from '@/shared/globalSupplier'

interface Props {
  booth?: Booth
}

interface State {}

@withContext(GlobalSupplierInfoContext.Consumer)
export class ADataTextGlobal extends React.PureComponent<Props, State> {
  render() {
    const { booth } = this.props
    const { supplier } = new SafeBooth(booth)
    const { description } = new SafeGlobalSupplier(supplier)

    if (description.length <= 0) return null

    return (
      <View style={styles.container}>
        <ATitle title={I18n.t('description')} />

        <View style={styles.wrapDescription}>
          <AViewMoreText numberOfLines={4}>
            <Text style={styles.description} numberOfLines={4}>
              {description}
            </Text>
          </AViewMoreText>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: metrics.keylines_screen_edge_margin,
  },
  wrapDescription: {
    paddingTop: 8,
  },
  description: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.black,
  },
})
