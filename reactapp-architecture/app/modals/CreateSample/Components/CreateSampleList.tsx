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
import { User } from '@/models/user'
import { colors, fonts, images } from '@/vars'
import { SafeUser } from '@/shared/user'
import { SafeStatusType } from '@/shared/statusType'

type Props = {
  onCreate: (taskInfo: any) => void
  onShowPicker: (type: string) => void
  assignee: User
  sampleName?: string
}

export class CreateSampleList extends React.PureComponent<Props> {
  _textInput: React.RefObject<TextInput> = React.createRef()
  _headerInputText: string

  static readonly defaultProps = {
    data: [],
    onShowPicker: Function.prototype,
  }

  onCreate = () => {
    const { onCreate } = this.props

    const textValue = this._headerInputText || this.props.sampleName
    if (!textValue || textValue.trim().length === 0) {
      // Todo show error ??
      this._textInput.current.clear()
      return
    }
    onCreate({ sampleName: textValue })
  }

  onChangeText = (text: string) => {
    this._headerInputText = text
  }

  render() {
    const { onShowPicker, assignee, sampleName, status } = this.props
    const statusName = status
      ? `${status.step}. ${SafeStatusType.getNameSample(status.name)}`
      : ''
    const { fullName } = new SafeUser(assignee)
    return (
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>
            {I18n.t('sampleName').toUpperCase()}
          </Text>
          <TextInput
            ref={this._textInput}
            style={styles.sectionTextInput}
            defaultValue={sampleName}
            autoFocus={false}
            onChangeText={this.onChangeText}
            blurOnSubmit={true}
          />
        </View>
        <TouchableOpacity
          style={styles.detailRow}
          onPress={() => onShowPicker('reAssign')}
        >
          <Text style={styles.detailTitle}>
            {I18n.t('assignee').toUpperCase()}
          </Text>
          <Text style={styles.sectionText}>{fullName}</Text>
          <Image source={images.rightChevron} style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.detailRow}
          onPress={() => onShowPicker('status')}
        >
          <Text style={styles.detailTitle}>
            {I18n.t('status').toUpperCase()}
          </Text>
          <Text style={styles.sectionText}>{statusName}</Text>
          <Image source={images.rightChevron} style={styles.arrow} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.validateButton} onPress={this.onCreate}>
          <Text style={styles.validateButtonTitle}>
            {I18n.t('sampleCreate')}
          </Text>
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
