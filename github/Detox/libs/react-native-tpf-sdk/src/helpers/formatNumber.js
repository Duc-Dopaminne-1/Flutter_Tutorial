export const formatNumber = x => {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return 0;
  }
};
export const formatNumberNoZero = x => {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return '';
  }
};

export const formatString = x => {
  if (x) {
    return x.split(',').join('');
  } else {
    return '';
  }
};

export const removeUnuseZero = x => {
  if (!x) {
    return '';
  } else {
    while (x.length > 1 && x[0] === '0') {
      x = x.substr(1, x.length - 1);
    }
    return x;
  }
};

export const formatNumberPoint = (x, div = '.') => {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, div);
  } else {
    return 0;
  }
};
