const {getProjectStatistic} = require('./getProjectStatistic');

it('getProjectStatistic', () => {
  const data1 = {
    saleSeasonStatistic: {
      saleSeasonId: 'f66cd612-e9cd-4d0b-ab02-313d20952728',
      depositCount: 1,
      availableCount: 98,
      soldCount: 1,
      bookedCount: 0,
      viewingCount: 256,
    },
    saleSeason: {
      saleSeasonId: 'f66cd612-e9cd-4d0b-ab02-313d20952728',
      startBookingDatetime: 1603879200000,
      endBookingDatetime: 1604224800000,
      openDatetime: 1604484000000,
      closeDatetime: 1604743200000,
      saleSeasonStatusId: '60401950-f147-4140-977e-297aeac1eb2a',
      seasonStatusName: 'ReservationOpening',
    },
  };
  expect(getProjectStatistic(data1)).toMatchSnapshot();

  const data2 = {
    saleSeasonStatistic: {
      saleSeasonId: 'd9771df6-f347-4cc4-ae52-0fe2d7eb771a',
      depositCount: 0,
      availableCount: 0,
      soldCount: 0,
      bookedCount: 0,
      viewingCount: 0,
    },
    saleSeason: {
      saleSeasonId: 'd9771df6-f347-4cc4-ae52-0fe2d7eb771a',
      startBookingDatetime: 1603520220000,
      endBookingDatetime: 1603520340000,
      openDatetime: 1603520400000,
      closeDatetime: 1604125320000,
      saleSeasonStatusId: 'b4b3bf25-0fd6-46a5-8464-d63a7fba93b6',
      seasonStatusName: 'SaleOpening',
    },
  };
  expect(getProjectStatistic(data2)).toMatchSnapshot();
});
