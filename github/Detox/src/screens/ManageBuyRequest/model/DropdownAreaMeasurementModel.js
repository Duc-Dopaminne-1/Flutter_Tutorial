import MeasureUtils from '../../../utils/MeasureUtils';

const areaMeasurementsData = [
  {
    id: 0,
    name: '<= ' + MeasureUtils.getSquareMeterText(30),
    fromValue: 0,
    toValue: 30,
    checked: false,
  },
  {
    id: 1,
    name: '30-' + MeasureUtils.getSquareMeterText(50),
    fromValue: 30,
    toValue: 50,
    checked: false,
  },
  {
    id: 2,
    name: '50-' + MeasureUtils.getSquareMeterText(100),
    fromValue: 50,
    toValue: 100,
    checked: false,
  },
  {
    id: 3,
    name: '100-' + MeasureUtils.getSquareMeterText(200),
    fromValue: 100,
    toValue: 200,
    checked: false,
  },
  {
    id: 4,
    name: '200-' + MeasureUtils.getSquareMeterText(500),
    fromValue: 200,
    toValue: 500,
    checked: false,
  },
  {
    id: 5,
    name: '>' + MeasureUtils.getSquareMeterText(500),
    fromValue: 500,
    toValue: null,
    checked: false,
  },
  {
    id: 6,
    name: 'Khác',
    fromValue: 0,
    toValue: 0,
    checked: false,
  },
];

const DROPDOWN_AREA_MEASUREMENT_MODEL = (data = []) => {
  const useDummyData = data && data.length > 0 ? false : true;
  const requestInfo = useDummyData ? areaMeasurementsData : data;
  return requestInfo;
};

export {DROPDOWN_AREA_MEASUREMENT_MODEL};
