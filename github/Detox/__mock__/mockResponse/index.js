import {Promise} from 'es6-promise';

const PropertyPost = {
  id: 0,
  title: 'Bán căn hộ 4 phòng ngủ tại quận 7',
  address: 'Phú Nhuận Quận 7',
  followerNumber: 120,
  tipRate: '1-2%',
  bedroom: 3,
  bathroom: 2,
  acreage: '100m2',
  price: '900tr',
};

const generatePropertyList = count => {
  const propertyList = [];
  for (let index = 0; index < count - 1; index++) {
    propertyList.push({
      ...PropertyPost,
      id: index,
    });
  }
  return propertyList;
};

const getPropertyList = async () => {
  try {
    const results = await new Promise((resolve, reject) =>
      setTimeout(() => {
        const randomBoolean = Math.random() < 0.5;
        if (randomBoolean) {
          resolve({isSuccess: true, data: generatePropertyList(15)});
        } else {
          reject({isSuccess: false, data: {message: 'Error case'}});
        }
      }, 5000),
    );
    return results;
  } catch (error) {
    return Promise.resolve({isSuccess: false, data: {message: 'Error case'}});
  }
};

export {getPropertyList};
