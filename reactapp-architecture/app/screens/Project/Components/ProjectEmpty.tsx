import * as React from 'react'
import { Image, Text, View, StyleSheet, ScrollView } from 'react-native'
import { colors, fonts, images, metrics, normalize } from '@/vars'
import I18n from 'react-native-i18n'
import { AButton } from '@/components/AButton/AButton'
import { navigation } from '@/navigation/navigation'

const defaultProps = {}

type DefaultProps = typeof defaultProps

type Props = Partial<{
  onPressCreate: () => void
}> &
  DefaultProps

export class ProjectEmpty extends React.PureComponent<Props> {
  renderImage = () => {
    return (
      <View style={styles.wrapImage}>
        <Image
          source={images.emptyProjectIcon}
          style={styles.image}
          resizeMode={'contain'}
        />
      </View>
    )
  }

  renderCreateButton = () => {
    const { onPressCreate } = this.props

    return (
      <View style={styles.wrapCreateButton}>
        <Text style={styles.createButtonTitle}>
          {I18n.t('youDonHaveAnyProjectsYet')}
        </Text>

        <Text style={styles.createButtonDescription}>
          {I18n.t('createYourFirstProjectNow')}
        </Text>

        <AButton
          title={I18n.t('createProject')}
          onPress={onPressCreate}
          containerStyle={styles.customButtonContainer}
          titleStyle={styles.customButtonTitle}
        />
      </View>
    )
  }

  renderInstruction = () => {
    return (
      <View style={styles.wrapInstruction}>
        <Text style={styles.instructionTitle}>
          {I18n.t('howToUseProjects')}
        </Text>

        {this.renderInstructionItemOne()}
        {this.renderInstructionItemTwo()}
        {this.renderInstructionItemThree()}
      </View>
    )
  }

  renderInstructionItemOne = () => {
    return (
      <View style={styles.wrapInstructionItem}>
        <View style={styles.wrapIcon}>
          <Image source={images.project} style={styles.icon} />
        </View>

        <View style={styles.wrapText}>
          <Text style={styles.instructionItemTitle}>
            {I18n.t('collectionAndCatalogues')}
          </Text>

          <Text style={styles.instructionItemDescription}>
            {I18n.t('collectionAndCataloguesDescription')}
          </Text>
        </View>
      </View>
    )
  }

  renderInstructionItemTwo = () => {
    return (
      <View style={styles.wrapInstructionItem}>
        <View style={styles.wrapIcon}>
          <Image source={images.team} style={styles.icon} />
        </View>

        <View style={styles.wrapText}>
          <Text style={styles.instructionItemTitle}>
            {I18n.t('clientProposal')}
          </Text>

          <Text style={styles.instructionItemDescription}>
            {I18n.t('clientProposalDescription')}
          </Text>
        </View>
      </View>
    )
  }

  renderInstructionItemThree = () => {
    return (
      <View style={styles.wrapInstructionItem}>
        <View style={styles.wrapIcon}>
          <Image source={images.save} style={styles.icon} />
        </View>

        <View style={styles.wrapText}>
          <Text style={styles.instructionItemTitle}>
            {I18n.t('specificSourcingProject')}
          </Text>

          <Text style={styles.instructionItemDescription}>
            {I18n.t('specificSourcingProjectDescription')}
          </Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {this.renderImage()}
        {this.renderCreateButton()}
        {this.renderInstruction()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
  },
  wrapImage: {
    alignSelf: 'center',
    marginTop: metrics.empty_project_header_image_margin_top,
  },
  image: {
    height: metrics.empty_project_header_image_size,
    width: metrics.empty_project_header_image_size,
  },
  wrapCreateButton: {
    marginTop: metrics.empty_project_button_title_margin_top,
  },
  createButtonTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    textAlign: 'center',
  },
  createButtonDescription: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    textAlign: 'center',
    marginTop: 8,
  },
  customButtonContainer: {
    margin: 0,
    height: metrics.empty_project_button_height,
    width: metrics.empty_project_button_width,
    borderRadius: metrics.small_base,
    marginTop: metrics.empty_project_button_margin_top,
    alignSelf: 'center',
  },
  customButtonTitle: {
    fontSize: fonts.size.l,
  },
  wrapInstruction: {
    marginTop: metrics.empty_project_instruction_margin_top,
    paddingHorizontal: metrics.empty_project_instruction_margin_horizontal,
    paddingBottom: metrics.keylines_screen_profile_title_margin,
    alignItems: 'center',
  },
  instructionTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xxl,
    color: colors.primary_blue,
    textAlign: 'center',
    marginBottom: metrics.empty_project_instruction_title_margin_Bottom,
  },
  wrapInstructionItem: {
    flexDirection: 'row',
    marginBottom: metrics.keylines_screen_profile_title_margin,
  },
  wrapIcon: {
    height: metrics.empty_project_instruction_wrap_icon_size,
    width: metrics.empty_project_instruction_wrap_icon_size,
    borderRadius: metrics.small_base,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.keylines_screen_product_info_margin,
  },
  icon: {
    height: metrics.empty_project_instruction_icon_size,
    width: metrics.empty_project_instruction_icon_size,
    tintColor: colors.blue_light_grey,
  },
  wrapText: {
    flex: 1,
  },
  instructionItemTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    marginBottom: 4,
  },
  instructionItemDescription: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    color: colors.blue_light_grey,
  },
})
