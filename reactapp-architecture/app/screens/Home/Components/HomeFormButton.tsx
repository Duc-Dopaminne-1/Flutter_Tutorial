import { colors, metrics, fonts } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { AButton } from '@/components/AButton/AButton'
import I18n from '@/i18n'

type HomeLatestButtonProps = {
  onViewAll?: () => void
  onAddNew?: () => void
  buttonTwoTitle?: string
}

export const HomeFormButton: React.SFC<HomeLatestButtonProps> = props => {
  const { onViewAll, onAddNew, buttonTwoTitle } = props
  return (
    <View style={styles.container}>
      <AButton
        containerStyle={styles.buttonViewContainer}
        title={I18n.t('viewAll2')}
        titleStyle={styles.textViewAll}
        onPress={onViewAll}
      />
      <AButton
        containerStyle={styles.buttonCreateNewProductContainer}
        titleStyle={styles.textCreateNewProduct}
        title={buttonTwoTitle}
        onPress={onAddNew}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingHorizontal: metrics.home_screen_form_button_padding_horizontal,
    paddingVertical: metrics.home_screen_form_button_padding_vertical,
  },
  buttonViewContainer: {
    flex: 1,
    backgroundColor: colors.background_gray,
    marginRight: metrics.home_screen_form_button_view_all_margin_right,
    margin: metrics.home_screen_form_button_left_margin,
    borderRadius: metrics.home_screen_form_button_left_border_radius,
  },
  buttonCreateNewProductContainer: {
    flex: 1,
    margin: metrics.home_screen_form_button_right_margin,
    borderRadius: metrics.home_screen_form_button_right_border_radius,
  },
  textViewAll: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
    // fontWeight: metrics.home_screen_form_button_text_font_weight,
    marginTop: metrics.home_screen_form_button_text_margin_top,
    marginBottom: metrics.home_screen_form_button_text_margin_bottom,
  },
  textCreateNewProduct: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
    // fontWeight: metrics.home_screen_form_button_text_font_weight,
    marginTop: metrics.home_screen_form_button_text_margin_top,
    marginBottom: metrics.home_screen_form_button_text_margin_bottom,
  },
})
