import PropTypes from 'prop-types';
import React from 'react';
import {Image, View, ViewPropTypes} from 'react-native';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import ProgressIndicator from 'react-native-progress/Circle';

import {ICONS} from '../assets/icons';
import CustomIcon from '../assets/icons/CustomIcon';
import {COLORS} from '../assets/theme/colors';
import {HELPERS} from '../assets/theme/helpers';
import UrlUtils from '../utils/UrlUtils';

const FastImageProgress = createImageProgress(FastImage);

const imageSource = (url, defaultImage) => {
  const validUrl = UrlUtils.getValidUrl(url);
  return validUrl ? {uri: validUrl} : defaultImage;
};

const ImageProgress = ({
  url,
  defaultImage,
  defaultIcon,
  imageStyle,
  containerStyle,
  imageContainerStyle,
  onLoadEnd,
  ...otherProps
}) => {
  const renderError = () => {
    setTimeout(() => {
      onLoadEnd();
    }, 0); // https://stackoverflow.com/a/63659469/5463717
    return (
      <View style={[HELPERS.center, containerStyle, {backgroundColor: COLORS.GREY_92}]}>
        {defaultImage ? (
          <Image style={imageStyle} source={defaultImage} />
        ) : (
          <CustomIcon size={16} name={defaultIcon} />
        )}
      </View>
    );
  };

  if (!url || !UrlUtils.getValidUrl(url)) {
    return renderError();
  }

  return (
    <View style={[HELPERS.center, containerStyle]}>
      <FastImageProgress
        style={imageContainerStyle}
        imageStyle={imageStyle}
        source={imageSource(url, defaultImage)}
        indicator={ProgressIndicator}
        renderError={renderError}
        onLoadEnd={onLoadEnd}
        {...otherProps}
      />
    </View>
  );
};

ImageProgress.propTypes = {
  url: PropTypes.string,
  size: PropTypes.number,
  containerStyle: ViewPropTypes.style,
  onLoadEnd: PropTypes.func,
};

ImageProgress.defaultProps = {
  url: '',
  size: 115,
  containerStyle: {},
  defaultImage: null,
  defaultIcon: ICONS.PHOTO,
  onLoadEnd: () => {},
};

export default ImageProgress;
