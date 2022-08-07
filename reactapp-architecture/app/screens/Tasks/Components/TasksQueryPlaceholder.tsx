import * as React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native'
import I18n from '@/i18n'
import { colors, fonts, images, devices, normalize, metrics } from '@/vars'
import { SearchKeywordType } from '@/services/global'

type Props = Readonly<{
  type?: SearchKeywordType
  onViewAll?: () => void
  onCreateSample?: () => void
}>

export class TasksQueryPlaceholder extends React.PureComponent<Props> {
  static readonly defaultProps = {
    onViewAll: () => null,
    onCreateSample: () => null,
    title: I18n.t('sampleEmptyAssign'),
    text: I18n.t('sampleEmptyHint'),
    hasViewAllButton: true,
  }

  get getData() {
    const { type } = this.props
    if (type === SearchKeywordType.AllTasks) {
      return {
        title: I18n.t('noTasks'),
        text: I18n.t('createTasksAndAssigned'),
        showButton: false,
      }
    }
    if (type === SearchKeywordType.MyTasks) {
      return {
        title: I18n.t('noTasks'),
        text: I18n.t('createTasksAndAssigned'),
        showButton: true,
      }
    }
    return {
      title: I18n.t('noTasksAssignedToYou'),
      text: I18n.t('createTasksAndAssigned'),
      showButton: true,
    }
  }

  renderHeaderIcon = () => {
    return (
      <View style={styles.emptyContentImageContainer}>
        <Image
          source={images.taskIcon}
          style={styles.emptyContentImage}
          resizeMode={'contain'}
        />
      </View>
    )
  }

  renderButton = () => {
    const { showButton } = this.getData
    const { onViewAll, onCreateSample } = this.props

    return (
      <View style={styles.emptyContentActionButtons}>
        <TouchableOpacity
          style={styles.createSampleActionButton}
          onPress={onCreateSample}
        >
          <Text style={styles.buttonCreate}>{I18n.t('createTask')}</Text>
        </TouchableOpacity>
        {!showButton ? null : (
          <TouchableOpacity
            style={styles.viewSamplesActionButton}
            onPress={onViewAll}
          >
            <Text style={styles.buttonViewAll}>{I18n.t('viewAllTask')}</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  render() {
    const { title, text } = this.getData

    return (
      <View style={styles.placeholderContainer}>
        <View
          style={[devices.isIOS ? styles.emptySpace1 : styles.emptySpace]}
        />

        {this.renderHeaderIcon()}

        <Text style={styles.placeholder1}>{title}</Text>
        <Text style={styles.placeholder2}>{text}</Text>

        {this.renderButton()}

        <Text style={styles.placeholder3}>
          {I18n.t('emptyTasksDescription')}
        </Text>
        <View style={styles.emptySpace} />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  emptySpace: {
    height: 120,
  },
  emptySpace1: {
    height: 32,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: metrics.keylines_screen_profile_title_margin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder1: {
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
    marginTop: 21,
  },
  placeholder2: {
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    marginTop: 8,
  },
  placeholder3: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    textAlign: 'center',
    marginTop: 32,
  },
  buttonCreate: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  buttonViewAll: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  createSampleActionButton: {
    backgroundColor: colors.status_validated,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 6,
  },
  emptyContentImageContainer: {},
  emptyContentImage: {
    width: normalize(128),
    height: normalize(128),
  },
  emptyContentActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  viewSamplesActionButton: {
    backgroundColor: colors.close_icon_gray,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 6,
  },
})
