import * as vars from '@constants/vars';
import { StyleSheet } from 'react-native';
import _ from 'lodash';

interface DefaultStyles {
  [key: string]: any;
}

const defaultStyles: DefaultStyles = {
  'flex-1': {
    flex: 1,
  },
  'drop-shadow': {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: vars.FONT_COLOR,
    fontSize: vars.FONT_SIZE_DEFAULT,
  },
  'text-bold': {
    fontWeight: '700',
  },
  'text-lg': {
    fontSize: vars.FONT_SIZE_LG,
  },
  'text-sm': {
    fontSize: vars.FONT_SIZE_SM,
  },
  h1: {
    fontSize: vars.FONT_SIZE_H1,
  },
  h2: {
    fontSize: vars.FONT_SIZE_H2,
  },
  h3: {
    fontSize: vars.FONT_SIZE_H3,
  },
  h4: {
    fontSize: vars.FONT_SIZE_H4,
  },
  radius: {
    borderRadius: vars.RADIUS_DEFAULT,
  },
  'radius-sm': {
    borderRadius: vars.RADIUS_SM,
  },
  'radius-lg': {
    borderRadius: vars.RADIUS_LG,
  },
  'radius-50': {
    borderRadius: '50%',
  },
  border: {
    borderColor: vars.BORDER_COLOR_DEFAULT,
    borderWidth: vars.BORDER_WIDTH,
  },
  ...['row', 'column'].reduce((styles: DefaultStyles, item: string) => {
    return {
      ...styles,
      [item]: {
        flexDirection: item,
      },
      [`${item}-start-start`]: {
        flexDirection: item,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      },
      [`${item}-start-center`]: {
        flexDirection: item,
        alignItems: 'flex-start',
        justifyContent: 'center',
      },
      [`${item}-start-end`]: {
        flexDirection: item,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
      },
      [`${item}-center-start`]: {
        flexDirection: item,
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      [`${item}-center-center`]: {
        flexDirection: item,
        alignItems: 'center',
        justifyContent: 'center',
      },
      [`${item}-center-end`]: {
        flexDirection: item,
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
      [`${item}-end-start`]: {
        flexDirection: item,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
      },
      [`${item}-end-center`]: {
        flexDirection: item,
        alignItems: 'flex-end',
        justifyContent: 'center',
      },
      [`${item}-end-end`]: {
        flexDirection: item,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      },
    };
  }, {}),
  pd: {
    padding: vars.SPACING_DEFAULT,
  },
  'pd-sm': {
    padding: vars.SPACING_SM,
  },
  'pd-lg': {
    padding: vars.SPACING_LG,
  },
  mg: {
    margin: vars.SPACING_DEFAULT,
  },
  'mg-sm': {
    margin: vars.SPACING_SM,
  },
  'mg-lg': {
    margin: vars.SPACING_LG,
  },
  ...['left', 'right', 'center', 'justify'].reduce(
    (styles: DefaultStyles, item: string) => ({
      ...styles,
      [`text-${item}`]: {
        textAlign: item,
      },
    }),
    {},
  ),
  ...['10', '25', '33', '50', '75', '100'].reduce(
    (styles: DefaultStyles, item: string) => ({
      ...styles,
      [`width-${item}`]: {
        width: `${item}%`,
      },
    }),
    {},
  ),
  ...['Left', 'Right', 'Top', 'Bottom', 'Vertical', 'Horizontal'].reduce(
    (styles: DefaultStyles, item: string) => ({
      ...styles,
      [`pd-${item[0].toLowerCase()}`]: {
        [`padding${item}`]: vars.SPACING_DEFAULT,
      },
      [`pd-${item[0].toLowerCase()}-sm`]: {
        [`padding${item}`]: vars.SPACING_SM,
      },
      [`pd-${item[0].toLowerCase()}-lg`]: {
        [`padding${item}`]: vars.SPACING_LG,
      },
      [`mg-${item[0].toLowerCase()}`]: {
        [`margin${item}`]: vars.SPACING_DEFAULT,
      },
      [`mg-${item[0].toLowerCase()}-sm`]: {
        [`margin${item}`]: vars.SPACING_SM,
      },
      [`mg-${item[0].toLowerCase()}-lg`]: {
        [`margin${item}`]: vars.SPACING_LG,
      },
      [`border-${item[0].toLowerCase()}`]: {
        borderColor: vars.BORDER_COLOR_DEFAULT,
        [`border${item}Width`]: vars.BORDER_WIDTH,
      },
    }),
    {},
  ),
  ...Object.keys(vars.colors).reduce((styles: DefaultStyles, colorKey: string) => {
    const key = colorKey.toLowerCase();
    const color = _.get(vars.colors, colorKey);
    return {
      ...styles,
      [`bg-${key}`]: {
        backgroundColor: color,
      },
      [`border-${key}`]: {
        borderColor: color,
      },
      [`color-${key}`]: {
        color,
      },
    };
  }, {}),
};
const dist: any = {};
const hashCode = (code = '') => {
  let chr = -1,
    hash = 0,
    i = 0;
  if (code.length === 0) return hash;
  for (i = 0; i < code.length; i++) {
    chr = code.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
    // Convert to 32bit integer
  }
  return hash;
};

const getStyles = (className: string) => {
  const hash = hashCode(className);
  if (dist[hash]) {
    return dist[hash];
  }
  let classStyles: any = {};
  className.split(' ').map((key: string) => {
    if (defaultStyles[key])
      classStyles = {
        ...classStyles,
        ...defaultStyles[key],
      };
    return true;
  });
  const { styles } = StyleSheet.create({
    styles: classStyles,
  });
  dist[hash] = styles;
  return styles;
};

export default getStyles;
