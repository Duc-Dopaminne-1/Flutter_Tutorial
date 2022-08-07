import I18n from '@/i18n'
import { colors, fonts, images } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AIcon } from '@/components/AIcon/AIcon'
import { Supplier } from '@/models/team'

type Props = Readonly<{
  contactName: string
  jobTitle: string
  supplier: Supplier
}>

export class CreateContactContentHeader extends React.PureComponent<Props> {
  renderIcon = () => {
    return (
      <View style={styles.wrapIcon}>
        <AIcon size={12} source={images.product} color={colors.primary_blue} />
        <Text style={styles.iconTitle}>{I18n.t('contact')}</Text>
      </View>
    )
  }

  renderInfo = () => {
    const { contactName, jobTitle, supplier } = this.props
    const name = contactName ? contactName : I18n.t('newContact')

    const renderJobName = jobTitle ? (
      <Text style={styles.jobName}> {jobTitle} </Text>
    ) : null
    const renderSupplier = supplier ? (
      <Text style={styles.supplierName}> {supplier.name} </Text>
    ) : null

    return (
      <View style={styles.wrapInfo}>
        <Text style={styles.contactName}>{name}</Text>

        {renderJobName}
        {renderSupplier}
      </View>
    )
  }

  render() {
    return (
      <>
        {this.renderIcon()}
        {this.renderInfo()}
      </>
    )
  }
}

const styles = StyleSheet.create<any>({
  wrapIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTitle: {
    color: colors.blue_light_grey,
    marginLeft: 8,
  },
  wrapInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  contactName: {
    color: colors.black,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xxl,
  },
  jobName: {
    fontSize: fonts.size.l,
    color: colors.primary_blue,
    marginTop: 4,
  },
  supplierName: {
    marginTop: 12,
    fontSize: fonts.size.l,
    color: colors.black_blue_text,
  },
})
