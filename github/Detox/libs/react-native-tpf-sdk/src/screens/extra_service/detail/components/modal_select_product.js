import React, { useState, useMemo, useContext } from 'react';
import { Modalize } from 'react-native-modalize';
import { scale } from '../../../../utils/responsive';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ICClose, ICRadioCheck, ICRadioUncheck } from '../../../../assets/icons';
import AppText from '../../../../components/app_text';
import { CUSTOM_COLOR } from '../../../../constants/colors';
import { FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import BodyText from '../../../../components/text/body_text';
import { DEVICE_HEIGHT } from '../../../../constants/size';
import themeContext from '../../../../constants/theme/themeContext';

const ModalSelectProduct = React.forwardRef(({ data, handleChoose }, ref) => {
  const theme = useContext(themeContext);
  const [currentProduct, setCurrentProduct] = useState(null);
  const onClose = () => {
    ref?.current.close();
  };
  const onChangeSelect = product => () => {
    setCurrentProduct(product);
  };
  const onChoose = () => {
    if (currentProduct) {
      ref?.current.close();
      const { id, name, partnerId } = currentProduct;
      handleChoose(id, name, partnerId);
    }
  };
  const renderHeader = () => {
    return (
      <View style={styles.modalTitle}>
        <TouchableOpacity onPress={onClose} style={styles.left}>
          <ICClose color1={theme.icon.color1} />
        </TouchableOpacity>
        <AppText translate semiBold style={styles.title}>
          {'additional_service_profiles.select_partner'}
        </AppText>
        <TouchableOpacity onPress={onChoose} style={styles.right}>
          <AppText
            translate
            semiBold
            style={[styles.textBtn, { color: theme?.app?.primaryColor1 }]}>
            {'common.select'}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.partnerItem} onPress={onChangeSelect(item)}>
        {currentProduct?.id === item.id ? (
          <ICRadioCheck fill={CUSTOM_COLOR.PersianGreen} color1={theme?.app?.primaryColor1} />
        ) : (
          <ICRadioUncheck fill={CUSTOM_COLOR.Bombay} />
        )}
        <BodyText style={styles.partnerName}>{item.partnerName}</BodyText>
      </TouchableOpacity>
    );
  };
  const renderSeparator = () => {
    return <View style={styles.separatorItem} />;
  };
  const modalHeight = useMemo(() => {
    let value = DEVICE_HEIGHT - scale(60);
    if (data?.length <= 5) {
      return DEVICE_HEIGHT / 2;
    }
    if (data?.length > 5 && data?.length <= 8) {
      return DEVICE_HEIGHT / 1.3;
    }
    return value;
  }, [data]);
  return (
    <Modalize
      modalStyle={styles.modalStyle}
      //adjustToContentHeight
      withHandle
      //modalHeight={modalHeight}
      withReactModal
      ref={ref}
      flatListProps={{
        data: data,
        renderItem: renderItem,
        keyExtractor: (item, index) => index,
        showsVerticalScrollIndicator: false,
        ItemSeparatorComponent: renderSeparator,
        contentContainerStyle: styles.listContainer
      }}
      HeaderComponent={renderHeader()}
    />
  );
});

export default ModalSelectProduct;
const styles = StyleSheet.create({
  modalStyle: {
    borderTopRightRadius: scale(16),
    borderTopLeftRadius: scale(16)
    // minHeight: DEVICE_HEIGHT / 2
    //maxHeight: DEVICE_HEIGHT - scale(65)
  },
  listContainer: { paddingHorizontal: scale(12), paddingBottom: scale(30) },
  modalTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    height: scale(56, false),
    justifyContent: 'space-between',
    borderBottomColor: CUSTOM_COLOR.GreyDivider
  },
  title: {
    textAlign: 'center',
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    flex: 1
  },
  partnerName: { flex: 1 },
  left: {
    width: scale(60),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
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
  partnerItem: { paddingVertical: scale(11), flexDirection: 'row', alignItems: 'center' },
  separatorItem: { height: 1, width: '100%', backgroundColor: CUSTOM_COLOR.GalleryDark }
});
