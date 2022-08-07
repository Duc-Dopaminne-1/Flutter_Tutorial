import * as React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native'
import I18n from '@/i18n'
import moment from 'moment/min/moment-with-locales.js'
import { User } from '@/models/user'
import { colors, fonts, images } from '@/vars'
import { SafeUser } from '@/shared/user'

type Props = {
  onCreate: (taskInfo: any) => void
  onShowPicker: (type: string) => void
  assignee: User
  dueDate: Date
}

export class CreateTaskList extends React.PureComponent<Props> {
  _textInput: React.RefObject<TextInput> = React.createRef()
  _headerInputText: string

  static readonly defaultProps = {
    data: [],
    onShowPicker: Function.prototype,
  }

  onCreate = () => {
    const { onCreate } = this.props

    if (!this._headerInputText || this._headerInputText.trim().length === 0) {
      // Todo show error ??
      this._textInput.current.clear()
      return
    }
    onCreate({ taskName: this._headerInputText })
  }

  onChangeText = (text: string) => {
    this._headerInputText = text
  }

  render() {
    const { onShowPicker, dueDate, assignee } = this.props
    const { fullName } = new SafeUser(assignee)

    const date = dueDate ? moment(dueDate).format('DD MMMM YYYY') : ''
    return (
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>{I18n.t('taskName')}</Text>
          <TextInput
            ref={this._textInput}
            style={styles.sectionTextInput}
            autoFocus={false}
            onChangeText={this.onChangeText}
            blurOnSubmit={true}
          />
        </View>
        <TouchableOpacity
          style={styles.detailRow}
          onPress={() => onShowPicker('reAssign')}
        >
          <Text style={styles.detailTitle}>{I18n.t('assignee')}</Text>
          <Text style={styles.sectionText}>{fullName}</Text>
          <Image source={images.rightChevron} style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.detailRow}
          onPress={() => onShowPicker('changeDate')}
        >
          <Text style={styles.detailTitle}>{I18n.t('taskDueDate')}</Text>
          <Text style={styles.sectionText}>{date}</Text>
          <Image source={images.rightChevron} style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.validateButton} onPress={this.onCreate}>
          <Text style={styles.validateButtonTitle}>{I18n.t('taskCreate')}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
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
    paddingHorizontal: 24,
    backgroundColor: colors.white,
  },
  detailRow: {
    marginHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.pale_grey,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  updatedBy: {
    padding: 24,
    width: '100%',
  },
  sectionText: {
    color: colors.black,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    paddingTop: 5,
    height: 30,
  },
  sectionTextInput: {
    color: colors.black,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    height: 30,
    padding: 0,
    ...Platform.select({
      ios: {
        paddingTop: 5,
      },
      android: {
        paddingTop: 1,
      },
    }),
  },
  detailTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.s,
    color: colors.light_blue_grey,
  },
  paddingHorizontal: {
    paddingHorizontal: 24,
  },
  details: {
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  validateButton: {
    borderRadius: 4,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary_blue,
    marginHorizontal: 24,
    marginTop: 24,
  },
  validateButtonTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
    color: colors.white,
  },
})
