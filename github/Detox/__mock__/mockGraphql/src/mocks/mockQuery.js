const {MockList} = require('apollo-server');
const faker = require('faker');

const sampleQuery = `
query GetAgents{
    cities(page:1, pageSize:5, order_by: {cityName: ASC}, where:{cityName_contains: "h"}){
      totalCount
      edges {
        cityName
        cityId
      }
    }
    
  }
`;

const Query = () => ({
  cities: (parent, args, context, info) => {
    const {page, pageSize, order_by, where} = args;
    console.log('page:', page, ', pageSize: ', pageSize);
    return {
      totalCount: 63,
      edges: () => new MockList(pageSize),
      // edges: () => [{cityName: faker.address.city}],
    };
  },
  agentById: (parent, args, context, info) => {
    return {
      agentId: () => '2cd9f8f4-7d46-54b6-69a8-bdcbe7767e05',
      instruction: () => 'instruction string',
      homeAddress: () => 'This is the home address',
      nationalId: () => '',
      agentCode: () => '',
      firstName: () => 'Van A',
      lastName: () => 'Nguyen',
      email: () => 'NguyenVanA@gmail.com',
      phoneNumber: () => '0123456789',
      agentGroupId: () => '',
      isInitialAccount: () => false,
      rating: () => 4.5,
      addressId: () => '',
      isAgentLeader: () => true,
      preferPropertyTypes: () =>
        '[{id:1 ,name:"Type 1"},{id:2 ,name:"Type 2"},{id:3 ,name:"Type 3"}]',
      preferPropertyPriceFrom: () => 100,
      preferPropertyPriceTo: () => 900,
      workingAreas: () =>
        '[{district: {id:1, name:"Bình Chánh"}, city: {id:1, name:"Hồ Chí Minh"} }]',
      agentGroupName: () => 'An Gia Quan 2',
      agentRankName: () => 'Đối tác Đồng',
      profilePhoto: () => 'https://picsum.photos/536/354',
      updated_datetime: () => 1583233184067,
    };
  },
  userById: (parent, args, context, info) => {
    return {
      userDto: () => {
        return {
          userId: () => '2cd9f8f4-7d46-54b6-69a8-bdcbe7767e05',
          firstName: () => 'Van A',
          lastName: () => 'Nguyen',
          profilePhoto: () => 'https://picsum.photos/536/354',
        };
      },
    }
  },
});

module.exports = Query;
