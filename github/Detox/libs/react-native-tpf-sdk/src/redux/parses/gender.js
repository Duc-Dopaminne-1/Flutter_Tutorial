export const parseGenders = (gender = '') => {
  switch (gender?.toLowerCase()) {
    case 'male':
      return 0;

    case 'female':
      return 1;

    default:
      return 2;
  }
};

export const parseGendersToString = gender => {
  switch (gender) {
    case 1:
      return 'FEMALE';

    default:
      return 'MALE';
  }
};
