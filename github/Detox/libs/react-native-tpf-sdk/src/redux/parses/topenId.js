export const parseTopenIdProfile = item => {
  return {
    name: item?.full_name,
    firstName: item?.first_name,
    lastName: item?.last_name,
    phone: item?.phone_number,
    dob: item?.dob,
    email: item?.email,
    gender: item?.gender,
    postalAddress: item?.postal_address
  };
};
