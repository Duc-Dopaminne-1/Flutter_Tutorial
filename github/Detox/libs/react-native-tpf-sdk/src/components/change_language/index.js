import React, { useContext, useState } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ICClose } from '../../assets/icons';
import { RadioBoxes } from '../../components/';
import AppText from '../../components/app_text';
import { supportLanguage } from '../../global/language';
import { closeModal, createModal } from '../../helpers/createModal';
import { setI18nConfig } from '../../i18n';
import { changeLanguage } from '../../redux/actions/settings';
import styles from './styles';
import themeContext from '../../constants/theme/themeContext';

const languages = [...supportLanguage].map(lang => ({
  value: lang?.locale || '',
  title: lang?.label || ''
}));

const ChangeLanguageModal = props => {
  const lang = useSelector(state => state.setting.lang);
  const [selected, setSelected] = useState(lang);
  const dispatch = useDispatch();
  const animation = React.useRef(new Animated.Value(0)).current;
  const theme = useContext(themeContext);
  const onClose = () => {
    closeModal();
  };

  const onSelect = () => {
    setI18nConfig(selected).then(() => {
      dispatch(changeLanguage(selected));
      closeModal();
    });
  };

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

  return (
    <View style={[styles.modalWrapper]}>
      <Animated.View styles={styles.backDrop} onPress={onClose} />
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
        <TouchableOpacity style={styles.selectContainer} onPress={onSelect}>
          <AppText
            translate
            semiBold
            style={[styles.selectText, { color: theme?.app?.primaryColor1 }]}>
            common.select
          </AppText>
        </TouchableOpacity>

        <AppText translate style={styles.textTitle} bold={true}>
          common.choose_language
        </AppText>
        <View style={styles.contentWrapper}>
          <RadioBoxes
            translate
            checked={selected}
            data={languages}
            onChange={setSelected}
            boxStyle={styles.idBoxes}
            containerStyle={styles.idContainerBoxes}
          />
        </View>
      </Animated.View>
    </View>
  );
};

ChangeLanguageModal.propTypes = {
  // bla: PropTypes.string,
};

ChangeLanguageModal.defaultProps = {
  // bla: 'test',
};

export const changeModal = () => {
  createModal(<ChangeLanguageModal />);
};
