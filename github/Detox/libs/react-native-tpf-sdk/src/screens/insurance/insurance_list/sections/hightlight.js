import { ShowAllTitle } from '../../../../components/';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../constants/appFonts';
import { CUSTOM_COLOR } from '../../../../constants/colors';
import { DEVICE_WIDTH, SPACING } from '../../../../constants/size';
import React, { useCallback, useMemo, useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import InsuranceProduct from '../../../../screens/insurance/components/product';
import { scale } from '../../../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  getInsuranceByCategoryHandle,
  getHighlightInsuranceCategoriesHandle
} from '../../../../redux/actions/insurance';
import { handleTouchItem } from '../../../../helpers/handleTouchItem';
import SCREENS_NAME from '../../../../constants/screens';
import { handleTouch } from '../../../../helpers/handleTouch';
import { EVENT_TYPE } from '../../../../constants/analyticEnums';
import themeContext from '../../../../constants/theme/themeContext';

const HighlightSection = props => {
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const highlightCategories = useSelector(state => state.insurance.highlightInsuranceCategory);
  const highlight = highlightCategories?.length > 0 ? highlightCategories[0] : null;
  const items = useSelector(state => state.insurance.insuranceProduct['' + highlight?.id || []]);
  const { topenId } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getHighlightInsuranceCategoriesHandle());
  }, [dispatch]);

  useEffect(() => {
    if (highlight) {
      dispatch(
        getInsuranceByCategoryHandle({
          categoryId: highlight?.id,
          skipCount: 0,
          maxResultCount: 5
        })
      );
    }
  }, [highlight, dispatch]);

  const [activeIndex, setActiveIndex] = useState(0);

  const onShowAll = useCallback(
    event => {
      handleTouch(event, 'SHOW_ALL', props.route, topenId, EVENT_TYPE.SHOW_ALL);
      navigation.navigate(SCREENS_NAME.ALL_INSURANCE_LIST_SCREEN, {
        category: highlight
      });
    },
    [props.route, topenId, navigation, highlight]
  );

  const onItemPress = useCallback(
    (event, item) => {
      handleTouchItem(
        event,
        'InsuranceItem',
        props.route,
        {
          ...item,
          categoryId: highlight?.id,
          isHighlight: true
        },
        topenId
      );
      navigation.navigate(SCREENS_NAME.INSURANCE_DETAIL_SCREEN, { item });
    },
    [props.route, highlight?.id, topenId, navigation]
  );

  const renderHighLightItem = ({ item }) => {
    return (
      <InsuranceProduct
        item={item}
        key={'Insurance' + item.id}
        style={styles.item}
        containerStyle={styles.itemContainer}
        fullWidth
        onPress={onItemPress}
      />
    );
  };

  const DotView = useMemo(
    () => (
      <View style={styles.dotContainer}>
        {items?.map((item, index) => {
          let isCurrent = index === activeIndex;
          return (
            <View
              key={'' + index}
              style={[
                styles.dot,
                isCurrent && [styles.currentDot, { backgroundColor: theme.app.primaryColor1 }]
              ]}
            />
          );
        })}
      </View>
    ),
    [activeIndex, items]
  );

  return items?.length > 0 ? (
    <View style={styles.container}>
      <>
        <ShowAllTitle
          style={{ paddingHorizontal: SPACING.Medium }}
          title={highlight?.name}
          onShowAll={onShowAll}
          enableShowAll
        />

        <Carousel
          loop
          autoplay
          data={items?.slice(0, 5) || []}
          renderItem={renderHighLightItem}
          onSnapToItem={index => setActiveIndex(index)}
          sliderWidth={DEVICE_WIDTH}
          itemWidth={DEVICE_WIDTH}
          style={styles.listContainer}
          inactiveSlideScale={1}
          slideStyle={{ marginVertical: 10 }}
        />
        {DotView}
      </>
    </View>
  ) : null;
};

export default HighlightSection;

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.Medium
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.Medium
  },
  title: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.Small,
    color: CUSTOM_COLOR.GreenPea
  },
  itemContainer: {
    marginHorizontal: SPACING.Medium,
    width: DEVICE_WIDTH - SPACING.Medium * 2
  },
  item: {
    width: DEVICE_WIDTH - SPACING.Medium * 2
  },
  listContainer: {},
  dotContainer: {
    marginTop: SPACING.Small,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dot: {
    borderRadius: scale(4),
    width: scale(15),
    height: scale(2.5),
    backgroundColor: CUSTOM_COLOR.Iceberg,
    marginStart: scale(2),
    marginEnd: scale(2)
  },
  currentDot: {
    borderRadius: scale(4),
    width: scale(15),
    height: scale(2.5),

    marginStart: scale(2),
    marginEnd: scale(2)
  }
});
