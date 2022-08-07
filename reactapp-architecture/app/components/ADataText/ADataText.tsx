import { ATitle } from '@/components/ATitle/ATitle'
import { AViewMoreText } from '@/components/AViewMoreText/AViewMoreText'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { fonts, metrics } from '@/vars'
import { colors } from '@/vars/colors'
import * as React from 'react'
import { StyleSheet, Text, View, TextStyle, ViewStyle } from 'react-native'
import { ADataRowEmpty } from '@/components/ADataRow/ADataRowEmpty'

interface ADataTextProps {
  description: string
  onOpen: () => void
  descriptionKey: number
  viewMoreText?: string
  viewLessText?: string
  viewMoreTextStyle?: TextStyle
  viewMoreTextContainerStyle?: ViewStyle
}

interface ADataTextState {}

export class ADataText extends React.PureComponent<
  ADataTextProps & AppContextState,
  ADataTextState
> {
  renderEmpty = () => {
    return (
      <View style={styles.emptyTextContainer}>
        <ADataRowEmpty
          title={I18n.t('description')}
          description={I18n.t('noDescriptionYet')}
          onPress={this.props.onOpen}
        />
      </View>
    )
  }

  renderDescription = (description: string) => {
    const {
      viewMoreText,
      viewLessText,
      viewMoreTextStyle,
      viewMoreTextContainerStyle,
    } = this.props
    return (
      <>
        <ATitle title={I18n.t('description')} />

        <View style={styles.wrapDescription}>
          <AViewMoreText
            numberOfLines={3}
            key={this.props.descriptionKey}
            viewMoreText={viewMoreText}
            viewLessText={viewLessText}
            viewMoreTextContainerStyle={viewMoreTextContainerStyle}
            viewMoreTextStyle={viewMoreTextStyle}
          >
            <Text
              style={styles.description}
              numberOfLines={4}
              onPress={this.props.onOpen}
            >
              {description}
            </Text>
          </AViewMoreText>
        </View>
      </>
    )
  }

  render() {
    const { description } = this.props
    const des = description ? description : ''
    const hasText = des.length > 0

    return (
      <View style={[des.length <= 0 ? {} : styles.container]}>
        {hasText ? this.renderDescription(des) : this.renderEmpty()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.base,
    backgroundColor: colors.white,
    borderRadius: metrics.supplier_border_radius,
    paddingTop: metrics.keylines_screen_edge_margin,
  },
  emptyTextContainer: {
    marginTop: metrics.base,
  },
  wrapDescription: {
    paddingTop: metrics.small_base,
    paddingBottom: metrics.small_base,
  },
  description: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
  wrapEmpty: {},
})
