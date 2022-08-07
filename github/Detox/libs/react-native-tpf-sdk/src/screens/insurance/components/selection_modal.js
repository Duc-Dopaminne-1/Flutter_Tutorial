import { ICClose, ICRadioCheck, ICRadioUncheck } from '../../../assets/icons';
import AppText from '../../../components/app_text';
import Divider from '../../../components/divider';
import PrimaryButton from '../../../components/primary_button';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import { BORDER_RADIUS, DEVICE_HEIGHT, DEVICE_WIDTH, SPACING } from '../../../constants/size';
import { formatNumber } from '../../../helpers/formatNumber';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import themeContext from '../../../constants/theme/themeContext';

export const SelectionModal = props => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { isVisible, data, title, onChange, onChangeVisible, translate = false } = props;
  const theme = useContext(themeContext);
  const onSelect = item => {
    setSelectedItem({ ...item });
  };

  const renderItem = item => (
    <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
      <View style={styles.leftContainer}>
        {selectedItem?.id === item.id ? (
          <ICRadioCheck color1={theme?.app?.primaryColor1} />
        ) : (
          <ICRadioUncheck />
        )}
        <Text style={styles.title}>{item.label}</Text>
      </View>
      <AppText translate bold={true} style={[styles.price, { color: theme?.text?.primary }]}>
        {formatNumber(item.price)}
        {'common.currency'}
      </AppText>
    </TouchableOpacity>
  );
  return (
    <View
      style={{
        width: isVisible ? '100%' : 0,
        height: isVisible ? '100%' : 0,
        position: 'absolute'
      }}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.backgound}
        onPress={() => onChangeVisible(false)}
      />
      <Animated.View style={styles.bodyBackground}>
        <View style={{ ...styles.container }}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => onChangeVisible(false)}>
              <ICClose />
            </TouchableOpacity>
            <AppText
              translate={translate}
              semiBold
              style={[styles.headerTitle, { color: theme?.text?.primary }]}
              numberOfLines={2}>
              {title}
            </AppText>
          </View>
          <Divider />
          <View
            style={{
              ...styles.scrollContainer,
              maxHeight: DEVICE_HEIGHT * 0.65
            }}>
            <ScrollView
              contentContainerStyle={{
                ...styles.scrollContent
              }}>
              {data?.length > 0 ? (
                data.map(item => renderItem(item))
              ) : (
                <View style={styles.noItem}>
                  <AppText translate style={styles.title}>
                    {'common.noData'}
                  </AppText>
                </View>
              )}
            </ScrollView>
          </View>
          <View style={{ ...styles.footer }}>
            <PrimaryButton
              translate
              title={'common.confirm'}
              onPress={() => {
                onChange(selectedItem);
                onChangeVisible(false);
              }}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: CUSTOM_COLOR.White,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS
  },
  backgound: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR.Black,
    opacity: 0.5,
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  bodyBackground: {
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    bottom: -1
  },
  headerRow: {
    paddingTop: SPACING.XXNormal,
    paddingBottom: SPACING.Fit,
    width: DEVICE_WIDTH
  },
  headerTitle: {
    marginLeft: SPACING.Medium,
    fontWeight: '700',
    fontSize: FONT_SIZE.Title3,
    lineHeight: LINE_HEIGHT.Heading,
    color: TEXT_COLOR.textBlack
  },

  scrollContainer: {
    width: DEVICE_WIDTH
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20
  },
  noItem: {
    width: DEVICE_WIDTH * 0.85,
    alignItems: 'center',
    paddingVertical: SPACING.XSmall
  },
  item: {
    paddingVertical: SPACING.XSmall,
    marginBottom: SPACING.Small,
    margin: SPACING.Medium,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,

    marginLeft: SPACING.Normal,
    flex: 1
  },
  footer: {
    paddingTop: SPACING.Small,
    paddingBottom: SPACING.BottomButton,
    marginHorizontal: SPACING.Medium
  },
  closeIcon: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: SPACING.Medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.Medium
  },
  leftContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: SPACING.Medium
  },
  price: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    color: TEXT_COLOR.textBlack,
    marginLeft: SPACING.Normal
  }
});
