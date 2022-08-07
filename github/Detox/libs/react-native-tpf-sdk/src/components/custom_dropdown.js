import { ICTickSelect } from '../assets/icons';
import { isEmpty } from 'lodash';
import React, { useCallback, useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider, PrimaryButton } from '../components';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../constants/colors';
import { BORDER_RADIUS, SPACING } from '../constants/size';
import { scale } from '../utils/responsive';
import themeContext from '../constants/theme/themeContext';

const CustomDropdown = props => {
  const { title, onVisibleChange, selectedIdx = 0, visible, data = [], onConfirm } = props;

  const { fonts } = useContext(themeContext) || {};

  const onClose = () => {
    onVisibleChange();
  };
  const onConfirmHandle = () => {
    !isEmpty(data) && onConfirm(data[tempSelectedIdx]);
    onVisibleChange();
  };

  const [tempSelectedIdx, setTempSelectedIdx] = useState(selectedIdx);
  const onChangeItem = useCallback(idx => {
    setTempSelectedIdx(idx);
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity style={styles.item} activeOpacity={0.8} onPress={() => onChangeItem(index)}>
        <Text style={styles.displayName}>{item}</Text>
        {index === tempSelectedIdx ? <ICTickSelect style={styles.checkIcon} /> : null}
      </TouchableOpacity>
    ),
    [onChangeItem, tempSelectedIdx]
  );

  const renderSeparator = useCallback(() => <Divider />, []);
  if (visible) {
    return (
      <View style={styles.dropdownBackground}>
        <View style={styles.dropdownContainer}>
          {title ? (
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { fontFamily: fonts?.BOLD }]}>{title}</Text>
            </View>
          ) : null}
          <View style={styles.contentContainer}>
            <View style={styles.flex}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item}
                ItemSeparatorComponent={renderSeparator}
                showsVerticalScrollIndicator={false}
                bounces={false}
              />
            </View>
            <View style={styles.footer}>
              <View style={[styles.flex, { marginRight: scale(15) }]}>
                <PrimaryButton
                  translate
                  title={'common.close'}
                  titleStyle={styles.backTitle}
                  onPress={onClose}
                  backgroundColor={'rgba(240, 140, 49, 0.25)'}
                  backgroundColorDisabled={BACKGROUND_COLOR.Silver}
                />
              </View>
              <View style={styles.flex}>
                <PrimaryButton
                  translate
                  title={'common.confirm'}
                  style={styles.comparationButton}
                  onPress={onConfirmHandle}
                  disabledText={styles.disabledText}
                  backgroundColorDisabled={BACKGROUND_COLOR.Silver}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return <View />;
  }
};

export default CustomDropdown;

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  dropdownBackground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  dropdownContainer: {
    width: '75%',
    maxHeight: '50%',
    backgroundColor: CUSTOM_COLOR.White,
    borderRadius: BORDER_RADIUS,
    flex: 1
  },
  backTitle: {
    color: CUSTOM_COLOR.Orange
  },
  disabledText: {
    color: CUSTOM_COLOR.White
  },
  footer: {
    paddingTop: SPACING.Normal,
    backgroundColor: BACKGROUND_COLOR.White,
    flexDirection: 'row'
  },
  titleContainer: {
    borderBottomWidth: scale(2),
    borderBottomColor: CUSTOM_COLOR.Alto,
    paddingVertical: SPACING.Normal
  },
  title: {
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    textAlign: 'center',
    color: CUSTOM_COLOR.BlueStone
  },
  contentContainer: {
    padding: SPACING.Medium,
    paddingTop: 0,
    flex: 1
  },
  item: {
    paddingVertical: SPACING.Normal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  checkIcon: {},
  displayName: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText,
    textAlign: 'center',
    color: CUSTOM_COLOR.GreenPea
  }
});
