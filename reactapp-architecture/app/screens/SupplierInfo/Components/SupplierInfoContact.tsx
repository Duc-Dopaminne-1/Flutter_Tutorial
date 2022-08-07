import { ContactCard } from '@/cards/Contact/ContactCard'
import { ContactCardEmpty } from '@/cards/Contact/ContactCardEmpty'
import { ATitle } from '@/components/ATitle/ATitle'
import I18n from '@/i18n'
import { Contact, Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SupplierInfoForm } from '@/screens/SupplierInfo/Components/SupplierInfoForm'
import { SupplierInfoContext } from '@/screens/SupplierInfo/SupplierInfoContext'
import { SafeContact } from '@/shared/contact'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { FlatList } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { debounce } from 'lodash'

type Props = Readonly<{
  tabLabel: string
  supplier?: Supplier
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  contacts: Realm.Collection<Contact>
}>

@withContext(AppContext.Consumer)
@withContext(SupplierInfoContext.Consumer)
@(withNavigation as any)
export class SupplierInfoContact extends React.PureComponent<Props, State> {
  _subscription: Subscription
  _results: Realm.Results<Contact>

  static navigationOptions = {
    header: 'New Contact',
  }

  readonly state = {
    contacts: [] as any,
  }

  componentDidMount(): void {
    const { supplier, contactFactory } = this.props

    const [subscription, results] = contactFactory.fetch({
      args: {
        supplierId: supplier.id,
      },
    })

    this._results = results

    this._subscription = subscription.subscribe(contacts => {
      // @todo: fix realmtime contact
      this.setState(
        {
          contacts,
        },
        () => {
          this.forceUpdate()
        }
      )
    })
  }

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  get isEmpty() {
    return this.state.contacts.length === 0
  }

  onPressCard = debounce((contact: Contact) => {
    const { navigation, supplier } = this.props

    const safeContact = new SafeContact(contact)

    navigation.navigate('CreateContactScreen', {
      supplier,
      contact,
      contactId: contact.id,
      headerTitle: safeContact.isDirty ? 'Contact' : 'Business Card',
    })
  }, 250)

  renderItem = ({ item }) => {
    return <ContactCard contact={item} onPress={() => this.onPressCard(item)} />
  }

  renderEmpty = () => {
    return <ContactCardEmpty onPress={this.onCreateContact} />
  }

  onCreateContact = () => {
    const { navigation, supplier } = this.props
    navigation.navigate('CreateContactScreen', {
      supplier,
      headerTitle: I18n.t('newContact'),
      createBusinessCard: true,
    })
  }

  render() {
    return (
      <SupplierInfoForm>
        <ATitle
          title={I18n.t('contacts')}
          subtitle={!this.isEmpty && I18n.t('addContact')}
          onPressSubtitle={this.onCreateContact}
        />
        <FlatList<Contact>
          data={this.state.contacts}
          extraData={this.state}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmpty}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </SupplierInfoForm>
    )
  }
}
