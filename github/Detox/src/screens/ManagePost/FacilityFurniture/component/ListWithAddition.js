import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import CustomItemWithRightButton from '../../../../components/CustomItemWithRightButton';
import IconTextButton from '../../../../components/IconTextButton';

const styles = StyleSheet.create({
  buttonContainer: {
    width: '48%',
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: SIZES.BORDER_RADIUS_100,
    borderStyle: 'dashed',
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    ...METRICS.smallHorizontalPadding,
    paddingVertical: SIZES.MARGIN_4,
    ...HELPERS.mainSpaceBetween,
  },
  buttonTextStyle: {
    ...METRICS.resetMarginBottom,
    ...FONTS.fontSize16,
    ...FONTS.regular,
    color: COLORS.PRIMARY_A100,
  },
  iconStyle: {
    ...METRICS.resetPaddingVertical,
  },
  listItemContainer: {
    ...HELPERS.rowSpaceBetween,
    marginVertical: SIZES.MARGIN_4,
  },
  itemContainer: {marginVertical: SIZES.MARGIN_4},
});

const TwoElementsOnRowView = ({
  leftElement,
  rightElement,
  index,
  itemStyle,
  disabledEdit,
  onEditItem,
  onDeleteItem,
  hasDistance,
  defaultRightElement,
  style,
}) => {
  let leftName = leftElement?.name ?? '';
  let rightName = rightElement?.name ?? '';
  if (hasDistance) {
    leftName = `${leftElement?.name} (${leftElement?.distance} km) `;
    rightName = `${rightElement?.name} (${rightElement?.distance} km) `;
  }
  return (
    <View key={index} style={[styles.listItemContainer, style]}>
      {leftElement && (
        <CustomItemWithRightButton
          disabled={disabledEdit}
          style={itemStyle}
          key={index}
          title={leftName}
          onPress={() => onEditItem(leftElement)}
          onRightIconClick={() => onDeleteItem(leftElement)}
        />
      )}
      {rightElement ? (
        <CustomItemWithRightButton
          disabled={disabledEdit}
          style={itemStyle}
          key={index + 1}
          title={rightName}
          onPress={() => onEditItem(rightElement)}
          onRightIconClick={() => onDeleteItem(rightElement)}
        />
      ) : (
        defaultRightElement
      )}
    </View>
  );
};

const AddButton = ({buttonAddStyle, onPressButton, title}) => (
  <IconTextButton
    style={[styles.buttonContainer, buttonAddStyle]}
    isMaterialIcon
    onPress={onPressButton}
    iconSize={16}
    imageName="plus"
    title={title}
    styleText={styles.buttonTextStyle}
    iconStyle={styles.iconStyle}
    color={COLORS.PRIMARY_A100}
    isIconLeft={false}
  />
);

const renderItems = ({
  items,
  onEditItem,
  onDeleteItem,
  limitNumber,
  hasDistance,
  itemStyle,
  disabled,
  buttonAddTitle,
  buttonAddStyle,
  onPressAdd,
}) => {
  const arrayViews = [];
  const hasNoItem = !items || items?.length === 0;
  const hasEnoughItems = items?.length >= limitNumber;

  const CustomAddButton = (
    <View style={styles.itemContainer}>
      <AddButton
        title={buttonAddTitle}
        buttonAddStyle={buttonAddStyle}
        onPressButton={onPressAdd}
      />
    </View>
  );

  if (hasNoItem) {
    return CustomAddButton;
  }

  for (let index = 0; index < items.length; index = index + 2) {
    const leftElement = items[index];
    const rightElement = index + 1 < items.length ? items[index + 1] : null;
    const isFullItem = rightElement;
    const isLastRow = index + 2 >= items.length;

    const viewItem = (
      <TwoElementsOnRowView
        key={index}
        leftElement={leftElement}
        onEditItem={onEditItem}
        onDeleteItem={onDeleteItem}
        rightElement={rightElement}
        defaultRightElement={
          <AddButton
            title={buttonAddTitle}
            buttonAddStyle={buttonAddStyle}
            onPressButton={onPressAdd}
          />
        }
        hasDistance={hasDistance}
        index={index}
        itemStyle={itemStyle}
        disabledEdit={disabled}
      />
    );
    arrayViews.push(viewItem);

    if (isFullItem && isLastRow && !hasEnoughItems) {
      arrayViews.push(CustomAddButton);
    }
  }

  return arrayViews;
};

const ListWithAddition = ({
  items,
  itemStyle,
  hasDistance = false,
  addText,
  limitNumber,
  disabledEdit = false,
  onAddItem = () => {},
  onEditItem = () => {},
  onDeleteItem = () => {},
  buttonAddStyle,
}) => {
  return (
    <View style={HELPERS.fill}>
      <View style={METRICS.tinyMarginTop}>
        {renderItems({
          items,
          itemStyle,
          limitNumber,
          hasDistance,
          disabled: disabledEdit,
          onEditItem,
          onDeleteItem,
          buttonAddTitle: addText,
          buttonAddStyle,
          onPressAdd: onAddItem,
        })}
      </View>
    </View>
  );
};

ListWithAddition.propTypes = {
  items: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired,
  hasDistance: PropTypes.bool,
  addText: PropTypes.string,
  limitNumber: PropTypes.number,
  itemStyle: PropTypes.object,
};

ListWithAddition.defaultProps = {
  items: [],
  setItems: () => {},
  hasDistance: false,
  addText: '',
  limitNumber: 10,
  itemStyle: {},
};

export default ListWithAddition;
