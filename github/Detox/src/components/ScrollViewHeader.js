import {NormalHeader} from 'react-native-spring-scrollview/NormalHeader';

import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';

export default class ScrollViewHeader extends NormalHeader {
  constructor(props) {
    super(props);
  }

  getTitle() {
    const s = this.state.status;
    if (s === 'pulling' || s === 'waiting') {
      return translate(STRINGS.PULL_DOWN_TO_REFRESH);
    } else if (s === 'pullingEnough') {
      return translate(STRINGS.RELEASE_TO_REFRESH);
    } else if (s === 'refreshing') {
      return translate(STRINGS.REFRESHING);
    } else if (s === 'pullingCancel') {
      return translate(STRINGS.GIVE_UP_REFRESHING);
    } else if (s === 'rebound') {
      return translate(STRINGS.REFRESH_COMPLETED);
    }
  }
}
