const faker = require('faker');

const CityDto = () => ({
  cityName: faker.address.city,
});

module.exports = CityDto;
