import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';

const DirectionsData = [
  {
    id: 0,
    name: translate(STRINGS.NORTH),
    checked: false,
  },
  {
    id: 1,
    name: translate(STRINGS.WEST),
    checked: false,
  },
  {
    id: 2,
    name: translate(STRINGS.SOUTH),
    checked: false,
  },
  {
    id: 3,
    name: translate(STRINGS.EAST),
    checked: false,
  },
  {
    id: 4,
    name: translate(STRINGS.NORTHEAST),
    checked: false,
  },
  {
    id: 5,
    name: translate(STRINGS.NORTHWEST),
    checked: false,
  },
  {
    id: 6,
    name: translate(STRINGS.SOUTHWEST),
    checked: false,
  },
  {
    id: 7,
    name: translate(STRINGS.SOUTHEAST),
    checked: false,
  },
];

const DROPDOWN_DIRECTION_MODEL = (data = []) => {
  const useDummyData = data && data.length > 0 ? false : true;
  const requestInfo = useDummyData ? DirectionsData : data;
  return requestInfo;
};

export {DROPDOWN_DIRECTION_MODEL};
