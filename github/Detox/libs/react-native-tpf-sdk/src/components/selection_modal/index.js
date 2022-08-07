import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { Modalize } from 'react-native-modalize';
import { scale } from '../../utils/responsive';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ICClose04, ICRadioCheck, ICRadioUncheck } from '../../assets/icons';
import AppText from '../app_text';
import { CUSTOM_COLOR } from '../../constants/colors';
import { FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import BodyText from '../text/body_text';
import themeContext from '../../constants/theme/themeContext';
import { PrimaryButton } from '../index';

const SelectionModal = React.forwardRef((props, ref) => {
  const { title, visible, value, onConfirm, onClose, data, showLoading } = props;

  const modalRef = useRef();
  const theme = useContext(themeContext);
  const [currentValue, setCurrentValue] = useState(null);
  const onChangeSelect = product => () => {
    setCurrentValue(product);
  };
  useEffect(() => {
    setCurrentValue(value);
    if (!visible) {
      modalRef?.current?.close();
      return;
    }
    modalRef?.current?.open();
  }, [visible]);
  const renderHeader = () => {
    return (
      <View style={styles.modalTitle}>
        <AppText translate bold style={styles.title}>
          {title}
        </AppText>
        <TouchableOpacity onPress={onClose} style={styles.left}>
          <ICClose04 color1={theme.icon.color1} />
        </TouchableOpacity>
      </View>
    );
  };
  const handleOnClosed = () => {
    if (visible) {
      // in the case use tap scroll down to close modal
      onClose();
    }
  };
  const renderFooter = () => {
    return (
      <View style={{ marginBottom: scale(34), marginHorizontal: scale(16) }}>
        <PrimaryButton
          translate
          disabled={!currentValue?.value}
          title={'common.confirm'}
          onPress={() => onConfirm(currentValue)}
        />
      </View>
    );
  };
  return (
    <Modalize
      modalStyle={styles.modalStyle}
      adjustToContentHeight
      withHandle
      onClosed={handleOnClosed}
      //modalHeight={modalHeight}
      withReactModal
      ref={modalRef}
      scrollViewProps={{
        contentContainerStyle: styles.listContainer,
        showsVerticalScrollIndicator: false
      }}
      HeaderComponent={renderHeader()}
      FooterComponent={renderFooter()}>
      <View style={showLoading ? { minHeight: scale(250) } : {}}>
        {data?.length === 0 && visible ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator color={CUSTOM_COLOR.DustyGray} size="large" />
          </View>
        ) : (
          data?.map((item, index) => (
            <View>
              <TouchableOpacity style={styles.itemContainer} onPress={onChangeSelect(item)}>
                {currentValue && currentValue?.value === item.value ? (
                  <ICRadioCheck
                    fill={CUSTOM_COLOR.PersianGreen}
                    color1={theme?.app?.primaryColor1}
                  />
                ) : (
                  <ICRadioUncheck fill={CUSTOM_COLOR.Bombay} />
                )}
                <BodyText style={styles.itemTitle}>{item.title}</BodyText>
              </TouchableOpacity>
              {index != data?.length - 1 && <View style={styles.separatorItem} />}
            </View>
          ))
        )}
      </View>
    </Modalize>
  );
});

export default SelectionModal;
const styles = StyleSheet.create({
  modalStyle: {
    borderTopRightRadius: scale(16),
    borderTopLeftRadius: scale(16)
  },
  listContainer: { paddingHorizontal: scale(12), paddingBottom: scale(30) },
  modalTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    height: scale(56, false),
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    borderBottomColor: CUSTOM_COLOR.GreyDivider
  },
  title: {
    fontSize: FONT_SIZE.Title3,
    lineHeight: LINE_HEIGHT.Title3
  },
  itemTitle: { flex: 1, fontSize: FONT_SIZE.BodyText, marginLeft: scale(12) },
  right: {
    width: scale(70),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: scale(16)
  },
  textBtn: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    color: CUSTOM_COLOR.PersianGreen
  },
  itemContainer: { paddingVertical: scale(16), flexDirection: 'row', alignItems: 'center' },
  separatorItem: { height: 1, width: '100%', backgroundColor: CUSTOM_COLOR.GalleryDark }
});
