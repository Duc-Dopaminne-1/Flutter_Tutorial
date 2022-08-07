import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, AppState } from 'react-native';

import { CustomText } from '../CustomText';
import { colors, fonts } from '../../vars';

export class CountDownComponent extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    until: PropTypes.number,
    onFinish: PropTypes.func,
    isAuctionProgress: PropTypes.bool,
    timeStyle: PropTypes.any,
    onPressTime: PropTypes.func,
  };

  state = {
    until: Math.max(this.props.until, 0),
    lastUntil: null,
    wentBackgroundAt: null,
  };

  constructor(props) {
    super(props);
    this.timer = setInterval(this.updateTimer, 1000);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.until !== prevProps.until || this.props.id !== prevProps.id) {
      this.setState({
        lastUntil: prevState.until,
        until: Math.max(prevProps.until, 0),
      });
    }
  }

  _handleAppStateChange = currentAppState => {
    const { until, wentBackgroundAt } = this.state;
    if (currentAppState === 'active' && wentBackgroundAt && this.props.running) {
      const diff = Math.floor((Date.now() - wentBackgroundAt) / 1000);
      this.setState({
        lastUntil: until,
        until: Math.max(0, until - diff),
      });
    }
    if (currentAppState === 'background') {
      this.setState({ wentBackgroundAt: Date.now() });
    }
  };

  getTimeLeft = () => {
    const { until } = this.state;
    return {
      seconds: until % 60,
      minutes: parseInt(until / 60, 10) % 60,
      hours: parseInt(until / (60 * 60), 10) % 24,
      days: parseInt(until / (60 * 60 * 24), 10),
    };
  };

  updateTimer = () => {
    // Don't fetch these values here, because their value might be changed
    // in another thread
    // const {lastUntil, until} = this.state;

    if (this.state.lastUntil === this.state.until || !this.props.running || this.props.until <= 0) {
      return;
    }
    if (this.state.until === 1 || (this.state.until === 0 && this.state.lastUntil !== 1)) {
      if (this.props.onFinish) {
        this.props.onFinish();
      }
      if (this.props.onChange) {
        this.props.onChange(this.state.until);
      }
    }

    if (this.state.until === 0) {
      this.setState({ lastUntil: 0, until: 0 });
    } else {
      if (this.props.onChange) {
        this.props.onChange(this.state.until);
      }
      this.setState({
        lastUntil: this.state.until,
        until: Math.max(0, this.state.until - 1),
      });
    }
  };

  renderCountDown = () => {
    const { isAuctionProgress, onPressTime, timeStyle } = this.props;
    const { days, hours, minutes, seconds } = this.getTimeLeft();

    let title = '';

    if (isAuctionProgress) {
      if (days > 0) {
        title = `${days}d`;
      } else if (hours > 0) {
        title = `${hours}h`;
      } else if (minutes > 0) {
        title = `${minutes}:${seconds}`;
      } else if (seconds > 0) {
        title = `${seconds}s`;
      }

      // eslint-disable-next-line react/jsx-filename-extension
      return <CustomText titleStyle={[styles.time, timeStyle]} title={title} />;
    }

    title = days === 0 ? title + '' : title + `${days}d `;
    title = hours === 0 ? title + '' : title + `${hours}h `;
    title = minutes === 0 ? title + '' : title + `${minutes}m `;
    title = seconds === 0 ? title + '0s' : title + `${seconds}s`;

    return <CustomText onPress={onPressTime} titleStyle={[styles.time, timeStyle]} title={title} numberOfLines={1} />;
  };

  render() {
    return <View style={this.props.style}>{this.renderCountDown()}</View>;
  }
}

CountDownComponent.defaultProps = {
  until: 0,
  running: true,
  isAuctionProgress: false,
  timeStyle: {},
  onPressTime: () => {},
};

const styles = StyleSheet.create({
  time: {
    fontSize: fonts.size.s14,
    fontWeight: '500',
    color: colors.white,
    marginLeft: 5,
  },
});
