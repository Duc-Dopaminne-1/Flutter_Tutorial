import translate from '@src/localize';
import * as RNLocalize from 'react-native-localize';
const countryList = require('../../../../node_modules/react-native-phone-input/lib/resources/countries.json');
export const countryCode = RNLocalize.getCountry().toLowerCase();
export const hardCountry =
  countryList &&
  countryList.map((obj: any) => {
    return { _key: obj.iso2, _value: obj.name };
  });

export const hardMonthWeek = [
  { _key: '0', _value: 'By Week' },
  { _key: '1', _value: 'By Month' },
];

export const hardLastest = [
  { _key: 'lastest', _value: 'Lastest' },
  { _key: 'all', _value: 'All' },
];

export const hardShowBy = [
  { _key: '', _value: 'Please Choose' },
  { _key: '0', _value: translate('filter.all_time') },
  { _key: '1', _value: translate('filter.specific_time') },
];

export const hardStatus = [{ _key: '0', _value: 'All Status' }];

export const hardAllType = [{ _key: '0', _value: 'All type' }];

export const hardYear = [
  { _key: '0', _value: '2017' },
  { _key: '1', _value: '2018' },
  { _key: '2', _value: '2019' },
  { _key: '3', _value: '2020' },
];
