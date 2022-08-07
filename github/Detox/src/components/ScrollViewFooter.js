import {NormalFooter} from 'react-native-spring-scrollview/NormalFooter';

import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';

export default class ScrollViewFooter extends NormalFooter {
  constructor(props) {
    super(props);
  }

  getTitle() {
    const s = this.state.status;
    if (s === 'dragging' || s === 'waiting') {
      return translate(STRINGS.DRAG_UP_TO_LOAD);
    } else if (s === 'draggingEnough') {
      return translate(STRINGS.RELEASE_TO_LOAD);
    } else if (s === 'loading') {
      return translate(STRINGS.LOADING_MORE);
    } else if (s === 'draggingCancel') {
      return translate(STRINGS.GIVE_UP_LOADING);
    } else if (s === 'rebound') {
      return translate(STRINGS.LOAD_COMPLETED);
    } else if (s === 'allLoaded') {
      return translate(STRINGS.NO_MORE_DATA);
    }
  }
}
