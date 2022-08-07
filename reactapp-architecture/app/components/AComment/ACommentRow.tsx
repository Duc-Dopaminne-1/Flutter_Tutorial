import * as React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Comment } from '@/models/team'
import { colors, fonts } from '@/vars'
import moment from 'moment/min/moment-with-locales.js'
import { get } from 'lodash'
import { SafeUser } from '@/shared/user'

type Props = {
  comment: Comment
}

export class ACommentRow extends React.PureComponent<Props> {
  static readonly defaultProps = {
    comment: {},
  }

  renderImage = (placeholder: string) => {
    const uri = get(this.props.comment, 'createdBy.avatar.urls[0].url')
    if (!uri) {
      return (
        <View style={styles.imageContainer}>
          <Text style={styles.imageText}>{placeholder}</Text>
        </View>
      )
    }
    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri }} />
      </View>
    )
  }

  render() {
    const { comment } = this.props
    const { text, createdBy, creationDate } = comment

    const user = new SafeUser(createdBy as any)
    const { fullName, logoPlaceholder } = user
    const date = creationDate ? moment(creationDate).format('DD MMM YYYY') : ''

    return (
      <View style={styles.row}>
        {this.renderImage(logoPlaceholder)}
        <View style={styles.container}>
          <Text style={styles.author}>{fullName}</Text>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.comment}>{text}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    paddingLeft: 12,
    marginBottom: 12,
  },
  imageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.status_background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 22,
    resizeMode: 'contain',
  },
  imageText: {
    color: colors.primary_blue,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
  },
  author: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
  },
  date: {
    color: colors.blue_light_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
  },
  comment: {
    color: colors.black_blue_text,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    marginTop: 8,
  },
})
