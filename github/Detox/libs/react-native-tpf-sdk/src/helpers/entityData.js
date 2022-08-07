import { LOCATION_DETAIL } from '../global/entity_type';
import { store } from '../redux/store/configureStore';

export const parseToLocationForm = address => {
  let location = {};
  if (address) {
    let display = [];
    const province = address.find(t => t.code === LOCATION_DETAIL.Province);
    const district = address.find(t => t.code === LOCATION_DETAIL.District);
    const ward = address.find(t => t.code === LOCATION_DETAIL.Ward);
    const addressDetail = address.find(t => t.code === LOCATION_DETAIL.AddressDetail);
    const zipCode = address.find(t => t.code === LOCATION_DETAIL.ZipCode);

    if (province) {
      display.push(LOCATION_DETAIL.Province);
      location.province = province.value;
    }
    if (district) {
      display.push(LOCATION_DETAIL.District);
      location.district = district.value;
    }
    if (ward) {
      display.push(LOCATION_DETAIL.Ward);
      location.ward = ward.value;
    }
    if (addressDetail) {
      display.push(LOCATION_DETAIL.AddressDetail);
      location.addressDetail = addressDetail.value;
    }
    if (zipCode) {
      display.push(LOCATION_DETAIL.ZipCode);
      location.zipCode = zipCode.value;
    }
    location.display = display;
  }
  return location;
};

export const parseLocationToString = location => {
  let address = [];
  let regionCode = [];
  let street = [];
  if (location.display.includes(LOCATION_DETAIL.ZipCode)) {
    street.push(location.zipCode);
  }
  if (location.display.includes(LOCATION_DETAIL.AddressDetail)) {
    street.push(location.addressDetail);
  }
  address.push(street.filter(t => t).join(', '));
  if (location.display.includes(LOCATION_DETAIL.Ward)) {
    regionCode.push(location.ward);
  }
  if (location.display.includes(LOCATION_DETAIL.District)) {
    regionCode.push(location.district);
  }
  if (location.display.includes(LOCATION_DETAIL.Province)) {
    regionCode.push(location.province);
  }
  let displayName = [];
  if (regionCode?.length > 0) {
    let region = store?.getState()?.masterData?.region;
    displayName = regionCode.map(t => region?.find(r => r.code === t)?.displayName || '');
    address.push(...displayName);
  }
  return address.filter(t => t).join(', ');
};

export const parseToSelectOptions = optionData => {
  let options = [];
  if (optionData?.length > 0) {
    options = optionData.map(item => {
      return { displayName: item.name, code: '' + item.value };
    });
  }
  return options;
};

export const parseSelectOptionsToRadioData = data => {
  const parseData = data?.map(item => {
    return { value: item.code, title: item.displayName };
  });

  return parseData;
};

export const parseToSelectData = data => {
  const parseData = data?.map(item => {
    return { ...item, label: item.name };
  });

  return parseData;
};
