import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Project } from '@/models/team'
import { SafeProject } from '@/shared/project'
import I18n from '@/i18n'
// @ts-ignore
import { ActionSheet } from '@/components/ActionSheet/ActionSheetScreen'
import { CustomAlert } from '@/shared/alert'
import { debounce } from 'lodash'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Prop = {
  project: Project
  totalProduct: number
  onPressMore: () => void
} & DefaultProps

export type State = Partial<{}> & Readonly<typeof initialState>

export class ProjectInfoHeader extends React.PureComponent<Prop, State> {
  _actionSheet: any = React.createRef()

  state: State = initialState

  // onPressMore = () => {
  //   this._actionSheet.show()
  // }
  //
  // onPressAction = debounce((index: number) => {
  //   switch (index) {
  //     case 0:
  //       this.confirmDelete()
  //       return
  //     default:
  //       return
  //   }
  // }, 100)
  //
  // confirmDelete = () => {
  //   CustomAlert.alertYesNo({
  //     message: I18n.t('deleteProjectConfirm'),
  //     onPressYes: this.props.deleteProject,
  //     onPressNo: () => {},
  //   })
  // }

  get getTotalProduct() {
    const { totalProduct } = this.props

    if (totalProduct > 1) {
      return totalProduct + ' ' + I18n.t('products')
    }

    return totalProduct + ' ' + I18n.t('product')
  }

  renderProject = () => {
    const { project, onPressMore } = this.props
    const { logo, name } = new SafeProject(project)
    const totalProduct = this.getTotalProduct

    return (
      <View style={styles.container}>
        <View style={styles.wrapIconName}>
          <Text style={styles.textIconName}>{logo}</Text>
        </View>

        <View style={styles.wrapName}>
          <Text style={styles.textName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.textTotalProject} numberOfLines={1}>
            {totalProduct}
          </Text>
        </View>

        <TouchableOpacity style={styles.wrapImage} onPress={onPressMore}>
          <Image style={styles.image} source={images.more} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <>
        {this.renderProject()}

        <View style={styles.line} />

        {/*<ActionSheet*/}
        {/*  ref={nodeRef => (this._actionSheet = nodeRef)}*/}
        {/*  options={[I18n.t('delete'), I18n.t('cancel')]}*/}
        {/*  destructiveButtonIndex={0}*/}
        {/*  cancelButtonIndex={1}*/}
        {/*  firstItem={1}*/}
        {/*  lastItem={1}*/}
        {/*  onPress={this.onPressAction}*/}
        {/*/>*/}
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapIconName: {
    width: 42,
    height: 42,
    backgroundColor: colors.background_gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textIconName: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
  wrapName: {
    flex: 15,
    paddingRight: metrics.double_base,
    justifyContent: 'center',
  },
  textName: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPBold,
    color: colors.dark_blue_grey,
  },
  textTotalProject: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.light_blue_grey,
  },
  wrapImage: {
    flex: 1,
    padding: metrics.base,
  },
  image: {
    width: 16,
    height: 16,
    tintColor: colors.text_light_grey,
  },
  line: {
    height: 1,
    backgroundColor: colors.background_gray,
  },
})
