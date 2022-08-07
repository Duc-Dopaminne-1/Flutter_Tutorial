const getUserFullName = userInfo => {
  let name = userInfo?.firstName?.trim() ?? '';
  const lastName = userInfo?.lastName?.trim() ?? '';
  if (lastName) {
    name = `${lastName} ${name}`;
  }

  return name;
};

const getInterestedAreaString = ({district, city}) => {
  let areaString = city ?? '';
  if (district) {
    areaString = `${district}, ${areaString}`;
  }

  return areaString;
};

const selectedAreaDisplayText = item => {
  if (!item) {
    return '';
  }

  const cityName = item?.city?.name || '';

  if (item?.districts?.length === 0) {
    return cityName;
  }

  const districtsText = item?.districts
    .map(elem => {
      return elem.name;
    })
    .join(', ');
  return `${districtsText} - ${cityName}`;
};

export {getInterestedAreaString, getUserFullName, selectedAreaDisplayText};
