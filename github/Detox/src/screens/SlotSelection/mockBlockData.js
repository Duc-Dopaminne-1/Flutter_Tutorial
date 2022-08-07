/* eslint-disable sonarjs/no-duplicate-string */
const propertyPosts = [
  {
    propertyCode: 'A08',
    price: 4000000000,
    numberOfBedrooms: 2,
    numberOfBathrooms: 2,
    numberOfBookingTransactions: 0,
    assigned: true,
    saleTrackingStatusName: 'opening-deposit',
  },
  {
    propertyCode: 'A07',
    price: 12000000000,
    numberOfBedrooms: 4,
    numberOfBathrooms: 8,
    numberOfBookingTransactions: 0,
    assigned: false,
    saleTrackingStatusName: 'opening-deposit',
  },
  {
    propertyCode: 'A06',
    price: 6000000000,
    numberOfBedrooms: 3,
    numberOfBathrooms: 7,
    numberOfBookingTransactions: 0,
    assigned: true,
    saleTrackingStatusName: 'opening-deposit',
  },
  {
    propertyCode: 'A05',
    price: 20000000000,
    numberOfBedrooms: 5,
    numberOfBathrooms: 4,
    numberOfBookingTransactions: 0,
    assigned: false,
    saleTrackingStatusName: 'opening-deposit',
  },
  {
    propertyCode: 'A06',
    price: 6000000000,
    numberOfBedrooms: 3,
    numberOfBathrooms: 7,
    numberOfBookingTransactions: 0,
    assigned: false,
    saleTrackingStatusName: 'hold-place',
  },
  {
    propertyCode: 'A05',
    price: 20000000000,
    numberOfBedrooms: 5,
    numberOfBathrooms: 4,
    numberOfBookingTransactions: 1,
    assigned: false,
    saleTrackingStatusName: 'booked',
  },
  {
    propertyCode: 'A08',
    price: 4000000000,
    numberOfBedrooms: 2,
    numberOfBathrooms: 2,
    numberOfBookingTransactions: 1,
    assigned: false,
    saleTrackingStatusName: 'booked',
  },
  {
    propertyCode: 'A07',
    price: 12000000000,
    numberOfBedrooms: 4,
    numberOfBathrooms: 8,
    numberOfBookingTransactions: 4,
    assigned: true,
    saleTrackingStatusName: 'new',
  },
];

const floors = () => {
  const data = [];
  for (let index = 0; index < 100; index++) {
    data.push({
      floor: `floor ${index}`,
      propertyPosts,
    });
  }
  return data;
};
const mockBlockData = {
  blockName: 'A2',
  totalOfPropertyPosts: 8,
  totalOfEmptyPropertyPosts: 4,
  totalOfSoldPropertyPosts: 0,
  totalOfBookedPropertyPosts: 0,
  propertyPosts: floors(),
  emptyPropertyPosts: [
    {
      floor: null,
      propertyPosts: [
        {
          propertyCode: 'A06',
          price: 6000000000,
          numberOfBedrooms: 3,
          numberOfBathrooms: 7,
          numberOfBookingTransactions: 0,
          assigned: false,
          saleTrackingStatusName: 'opening-deposit',
        },
        {
          propertyCode: 'A05',
          price: 20000000000,
          numberOfBedrooms: 5,
          numberOfBathrooms: 4,
          numberOfBookingTransactions: 0,
          assigned: false,
          saleTrackingStatusName: 'opening-deposit',
        },
        {
          propertyCode: 'A08',
          price: 4000000000,
          numberOfBedrooms: 2,
          numberOfBathrooms: 2,
          numberOfBookingTransactions: 0,
          assigned: false,
          saleTrackingStatusName: 'opening-deposit',
        },
        {
          propertyCode: 'A07',
          price: 12000000000,
          numberOfBedrooms: 4,
          numberOfBathrooms: 8,
          numberOfBookingTransactions: 0,
          assigned: false,
          saleTrackingStatusName: 'opening-deposit',
        },
      ],
    },
  ],
  bookedPropertyPosts: [],
  soldPropertyPosts: [],
};

export default mockBlockData;
