import _ from 'lodash';
// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid } from 'react-native';

export interface Contact {
  value: string;
  phone: string;
  key: string;
  isSelected: boolean;
  isInvited: boolean;
}

class ShareContacts {
  private contacts: Contact[];
  private contactsAll: Contact[];
  private idSelected = [];
  private prepareContactsSelectAll = [];
  private prepareContactsUnSelectAll = [];
  private prepareIdSelectedAll = [];

  getTotalSelect(): number {
    return this.idSelected.length;
  }

  getSelected() {
    return this.idSelected;
  }

  setResetSelect() {
    this.idSelected.length = 0;
  }

  setContactAll(contact: Contact[]) {
    this.contactsAll = contact;
  }

  setContact(contact: Contact[]) {
    this.contacts = contact;
  }

  getContact(): Contact[] {
    return this.contacts;
  }

  getContactLength(): number {
    return this.contacts.length;
  }

  compare(a, b) {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  }

  filterContact(contacts) {
    const data = contacts.map(data => {
      const phone = data.phoneNumbers.length > 0 ? data.phoneNumbers[0].number : '';
      return {
        key: Math.random().toString(),
        value: (data.familyName + ' ' + data.givenName).trim(),
        phone,
        isSelected: false,
      };
    });
    data.sort(this.compare);
    this.setContact(data);
    // this.setContactAll(data);
    // this.setContact(data.slice(0, 20));
  }

  filterContactInvited(invited: any) {
    const data = this.contacts.map(data => {
      return {
        ...data,
        isInvited: invited.findIndex(item => item.inviteePhoneNumber === data.phone) >= 0,
      };
    });

    this.setContact(data);
  }

  prepareSelectAll() {
    this.prepareContactsSelectAll = this.contacts.map(item => {
      if (!item.isInvited) {
        this.prepareIdSelectedAll.push(item.phone);
      }

      return {
        ...item,
        isSelected: item.hasOwnProperty('isInvited') ? !item.isInvited : true,
      };
    });

    this.prepareContactsUnSelectAll = _.clone(
      this.contacts.map(item => {
        if (!item.hasOwnProperty('isInvited') || !item.isInvited) {
          this.prepareIdSelectedAll.push(item.phone);
        }

        return {
          ...item,
          isSelected: false,
        };
      }),
    );

    this.prepareIdSelectedAll = Array.from(new Set(this.prepareIdSelectedAll));
  }

  selectAll() {
    this.contacts = this.prepareContactsSelectAll;
    this.idSelected = this.prepareIdSelectedAll;
  }

  unSelectAll() {
    this.contacts = _.clone(this.prepareContactsUnSelectAll);
    this.idSelected = [];
  }

  selected(key: string) {
    const indexItem = this.contacts.findIndex(obj => obj.key === key);
    if (indexItem < 0) return;

    this.contacts[indexItem] = {
      ...this.contacts[indexItem],
      isSelected: true,
    };

    this.idSelected.push(this.contacts[indexItem].phone);
  }

  unSelected(key: string) {
    const indexItem = this.contacts.findIndex(obj => obj.key === key);
    if (indexItem < 0) return;
    this.contacts[indexItem].isSelected = false;
    this.idSelected = this.idSelected.filter(item => item !== this.contacts[indexItem].phone);
  }

  async hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.READ_CONTACTS;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
}

export const shareContacts = new ShareContacts();
