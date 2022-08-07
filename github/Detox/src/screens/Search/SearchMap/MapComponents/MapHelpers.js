import {StyleSheet} from 'react-native';

import {normal} from '../../../../assets/theme/metric';

export const MARKER_TYPE = {
  TEXT: 'MARKER_TYPE_TEXT',
  AVATAR: 'MARKER_TYPE_AVATAR',
};

export const SEARCH_TYPE = {
  PROJECTS: 'SEARCH_TYPE_PROJECTS',
  PROPERTY_POSTS: 'SEARCH_TYPE_PROPERTY_POSTS',
  AGENTS: 'SEARCH_TYPE_AGENTS',
  SPIDERS: 'SEARCH_TYPE_SPIDERS',
};

export const DEFAULT_COORDINATES = {
  latitude: 10.815913,
  longitude: 106.707476,
};

const Z_INDEX = {
  BUTTON_LIST: 1,
  MAP_TAB: 2,
  POPUP_ITEM: 3,
};

export const searchMapStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  buttonList: {
    position: 'absolute',
    bottom: 70,
    left: normal,
    zIndex: Z_INDEX.BUTTON_LIST,
  },
  popupItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  agentPopupItem: {
    position: 'absolute',
    bottom: 10,
    left: normal,
    right: normal,
    zIndex: Z_INDEX.POPUP_ITEM,
  },
  contentPopup: {
    paddingHorizontal: normal,
  },
  // viewContainerPoup: {
  //   backgroundColor: 'black',
  //   borderRadius: 8,
  // },
  mapTab: {
    position: 'absolute',
    bottom: 30,
    left: normal,
    right: normal,
    zIndex: Z_INDEX.MAP_TAB,
  },
});

export const PADDING_MAP = 30;
