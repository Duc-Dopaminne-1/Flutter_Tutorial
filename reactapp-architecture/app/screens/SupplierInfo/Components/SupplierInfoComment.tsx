import * as React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native'
import I18n from '@/i18n'
import { colors, fonts, images } from '@/vars'
import { withContext } from '@/shared/withContext'
import { isEmpty } from 'lodash'
import { Supplier } from '@/models/team'
import { ACommentList } from '@/components/AComment/ACommentList'
import {
  onAddSupplierComment,
  SupplierInfoContext,
} from '../SupplierInfoContext'
import { SafeSupplier } from '@/shared/supplier'

type Props = {
  supplier?: Supplier
  safeSupplier?: SafeSupplier
  tabLabel?: string
}

@withContext(SupplierInfoContext.Consumer)
export class SupplierInfoComment extends React.PureComponent<Props> {
  onAddComment = () => {
    onAddSupplierComment.next()
  }

  renderPlaceholder = () => {
    const { safeSupplier } = this.props

    if (!isEmpty(safeSupplier.comments)) {
      return null
    }
    return (
      <View style={styles.placeholderContainer}>
        <View style={styles.emptyContentImageContainer}>
          <Image source={images.comment} style={styles.emptyContentImage} />
        </View>
        <Text style={styles.placeholder1}>
          {I18n.t('commentSupplierEmpty')}
        </Text>
        <Text style={styles.placeholder2}>
          {I18n.t('commentProductEmptyText')}
        </Text>
        <View style={styles.emptyContentActionButtons}>
          <TouchableOpacity
            style={styles.createCommentActionButton}
            onPress={this.onAddComment}
          >
            <Text style={styles.buttonCreate}>{I18n.t('commentAdd')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { safeSupplier } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{I18n.t('comments')}</Text>
          <TouchableOpacity onPress={this.onAddComment}>
            <Text style={styles.addButton}>{I18n.t('commentAdd')}</Text>
          </TouchableOpacity>
        </View>
        <ACommentList style={styles.padding} comments={safeSupplier.comments} />
        {this.renderPlaceholder()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 12,
  },
  padding: {
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
    marginVertical: 12,
  },
  addButton: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
    color: colors.primary_blue,
  },
  emptySpace: {
    ...Platform.select({
      ios: {
        height: 68 + 32,
      },
      android: {
        height: 64 + 32,
      },
    }),
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 500,
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder1: {
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
    marginTop: 12,
  },
  placeholder2: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    marginTop: 10,
  },
  buttonCreate: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
  },
  createCommentActionButton: {
    backgroundColor: colors.primary_blue,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginRight: 6,
  },
  emptyContentImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.status_background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContentImage: {
    alignSelf: 'center',
    resizeMode: 'contain',
    tintColor: colors.primary_blue,
    width: 32,
    height: 31,
  },
  emptyContentActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  viewSamplesActionButton: {
    backgroundColor: colors.close_icon_gray,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 6,
  },
})
