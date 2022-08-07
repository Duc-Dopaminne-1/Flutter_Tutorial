import React, { useContext } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import themeContext from '../../constants/theme/themeContext';
import { ICClose } from '../../assets/icons';
import { help_box } from '../../assets/images';
import AppText from '../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../constants/colors';
import { closeModal, createModal } from '../../helpers/createModal';
import { scale } from '../../utils/responsive';

const HelpBox = ({ title, message, callBackWhenClose }) => {
  const animation = React.useRef(new Animated.Value(0)).current;
  const theme = useContext(themeContext);
  React.useEffect(() => {
    Animated.timing(animation, {
      duration: 300,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, []);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0]
  });

  const onClose = () => {
    closeModal();
    callBackWhenClose?.();
  };

  return (
    <View style={styles.helpBoxWrapper}>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [
              {
                translateY
              }
            ]
          }
        ]}>
        <TouchableOpacity style={styles.closeContainer} onPress={onClose}>
          <ICClose />
        </TouchableOpacity>
        <Image style={styles.image} source={help_box} />
        <AppText translate style={styles.textTitle} bold={true}>
          {title}
        </AppText>
        <View style={styles.descriptionContainer}>
          <AppText translate style={[styles.textDescription, { color: theme?.text?.secondary }]}>
            {message}
          </AppText>
        </View>
      </Animated.View>
    </View>
  );
};

HelpBox.propTypes = {
  // bla: PropTypes.string,
};

HelpBox.defaultProps = {
  // bla: 'test',
};

const styles = StyleSheet.create({
  helpBoxWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '80%',
    alignItems: 'center',
    borderRadius: scale(12),
    backgroundColor: BACKGROUND_COLOR.White
  },
  image: {
    marginTop: scale(24)
  },
  closeContainer: {
    top: scale(16),
    right: scale(16),
    position: 'absolute'
  },
  textTitle: {
    marginTop: scale(16),
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading
  },
  textDescription: {
    textAlign: 'justify',
    marginTop: scale(12),
    marginBottom: scale(16),
    marginHorizontal: scale(16),
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  }
});

const createHelpBox = (title = '', message = '', callBackWhenClose) => {
  createModal(<HelpBox title={title} message={message} callBackWhenClose={callBackWhenClose} />);
};

export default createHelpBox;
