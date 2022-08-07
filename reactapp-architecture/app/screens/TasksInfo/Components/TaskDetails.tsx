import * as React from 'react'
import I18n from '@/i18n'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { colors, fonts, images } from '@/vars'
import { Task } from '@/models/team'
import { ADataText } from '@/components/ADataText/ADataText'
import moment from 'moment/min/moment-with-locales.js'
import { SafeUser } from '@/shared/user'

export type TaskActionType =
  | 'validate'
  | 'reAssign'
  | 'delete'
  | 'changeDate'
  | 'changeProduct'
  | 'changeSupplier'
  | 'changeName'

type Props = Partial<{
  task: Task
  openTextEditor: () => void
  onTaskAction: (type: TaskActionType) => void
}>

export type State = {}

export class TaskDetails extends React.PureComponent<Props, State> {
  onTaskAction = (type: TaskActionType) => {
    const { onTaskAction } = this.props
    onTaskAction && onTaskAction(type)
  }

  render() {
    const { task = {} as any, openTextEditor } = this.props
    const date = task.dueDate ? moment(task.dueDate).format('DD MMMM YYYY') : ''
    const { fullName: creator } = new SafeUser(task.createdBy)
    const { fullName: updater } = new SafeUser(task.lastUpdatedBy)
    const { fullName: assignee } = new SafeUser(task.assignee)
    const createdByMessage = !creator
      ? ''
      : `${I18n.t('taskCreatedBy')} ${creator} ${I18n.t(
          'taskActionByDate'
        )} ${moment(task.creationDate).format('DD MMMM YYYY')}`
    const lastUpdatedByMessage = !updater
      ? ''
      : `${I18n.t('taskLastUpdatedBy')} ${updater} ${I18n.t(
          'taskActionByDate'
        )} ${moment(task.lastUpdatedDate).format('DD MMMM YYYY')}`
    return (
      <React.Fragment>
        <View style={styles.detailsDescription}>
          <ADataText
            onOpen={openTextEditor}
            description={task.description}
            descriptionKey={1}
            viewMoreText={I18n.t('viewMore')}
            viewLessText={I18n.t('taskViewLess')}
            viewMoreTextContainerStyle={{ backgroundColor: 'transparent' }}
            viewMoreTextStyle={{ color: colors.primary_blue }}
          />
        </View>
        <View style={styles.details}>
          <Text style={[styles.sectionTitle, styles.paddingHorizontal]}>
            {I18n.t('taskDetails')}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>{I18n.t('taskName')}</Text>
            <Text style={styles.sectionText}>{task.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => this.onTaskAction('reAssign')}
          >
            <Text style={styles.detailTitle}>{I18n.t('assignee')}</Text>
            <Text style={styles.sectionText}>{assignee}</Text>
            <Image source={images.rightChevron} style={styles.arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => this.onTaskAction('changeDate')}
          >
            <Text style={styles.detailTitle}>{I18n.t('taskDueDate')}</Text>
            <Text
              style={[
                styles.sectionText,
                task.dueDate < new Date() && { color: colors.warning },
              ]}
            >
              {date}
            </Text>
            <Image source={images.rightChevron} style={styles.arrow} />
          </TouchableOpacity>
        </View>
        <View style={styles.updatedBy}>
          <Text style={styles.createdBy}>{createdByMessage}</Text>
          <Text style={styles.createdBy}>{lastUpdatedByMessage}</Text>
        </View>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  arrow: {
    right: 0,
    alignSelf: 'center',
    position: 'absolute',
  },
  createdBy: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.s,
    color: colors.blue_light_grey,
  },
  detailsDescription: {
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  detailRow: {
    marginHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.pale_grey,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  updatedBy: {
    padding: 12,
    width: '100%',
  },
  sectionText: {
    color: colors.black,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    paddingTop: 5,
  },
  detailTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.s,
    color: colors.light_blue_grey,
  },
  sectionTitle: {
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
  },
  paddingHorizontal: {
    paddingHorizontal: 12,
  },
  details: {
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
})
