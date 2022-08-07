import { ContactCardAvatar } from '@/cards/Contact/ContactCardAvatar'
import { ContactCardCard } from '@/cards/Contact/ContactCardCard'
import { AIcon } from '@/components/AIcon/AIcon'
import I18n from '@/i18n'
import { Contact } from '@/models/team'
import { SafeContact } from '@/shared/contact'
import { colors, images } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = Readonly<{
  contact: Contact
  onPress(): void
}>

export class ContactCard extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const { contact, onPress } = this.props
    const safeContact = new SafeContact(contact)

    return (
      <TouchableOpacity style={styles.row} onPress={onPress}>
        {safeContact.isDirty ? (
          <ContactCardAvatar title={safeContact.logoPlaceholder} />
        ) : (
          <ContactCardCard />
        )}

        <View style={styles.wrapper}>
          <View style={{ flex: 1 }}>
            {safeContact.isDirty ? (
              <Text style={styles.title}>{safeContact.name}</Text>
            ) : (
              <Text style={styles.title}>{I18n.t('businessCard')}</Text>
            )}

            {safeContact.isDirty ? (
              <Text style={styles.subtitle}>{safeContact.jobTitle}</Text>
            ) : (
              <Text
                style={[
                  styles.subtitle,
                  {
                    fontStyle: 'italic',
                    color: colors.text_light_grey,
                  },
                ]}
              >
                {I18n.t('fillInfoBusinessCard')}
              </Text>
            )}
          </View>

          <View style={{ marginRight: 14 }}>
            <AIcon
              source={images.rightChevron}
              iconStyle={{ tintColor: colors.light_blue_grey }}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapper: {
    marginLeft: 8,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.pale_grey,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.dark_blue_grey,
  },
  subtitle: {
    marginTop: 4,
    color: colors.blue_light_grey,
  },
})
