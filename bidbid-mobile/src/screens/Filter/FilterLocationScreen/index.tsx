import React, { ReactElement, useEffect, useRef, useState, memo } from 'react';
import { View, Platform, BackHandler, Text, StyleSheet, Pressable, KeyboardAvoidingView } from 'react-native';
import { colors, fonts, screenHeight, screenWidth } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { language } from '@/i18n';
import { FilterHeaderView } from '../Commons/FilterHeaderView';
import { FilterLineBreak } from '../Commons/FilterLineBreak';
import { FilterBottomView } from '../Commons/FilterBottomView';
import Accordion from 'react-native-collapsible/Accordion';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import DefaultText from '@/components/CustomText/DefaultText';
import { MapSearch } from '@/screens/Map/component/MapSearch';
import { deleteFilterLocation, setFilterDistance, setFilterLocation } from '@/redux/filters/actions';
import { isAndroid } from '@/shared/devices';
import Modal from 'react-native-modal';
import ErrorMessage from '@/components/ErrorMessage';
import ModalLoading from '@/components/ModalLoading';
import RadioCheckedSVG from '@/components/SVG/RadioCheckedSVG';
import RadioUnCheckSVG from '@/components/SVG/RadioUnCheckSVG';

interface FilterLocationScreenProps {
  isFromSetting?: boolean;
  onBackdropPress?: () => void;
  isVisible?: boolean;
}

function FilterLocationScreen(props: FilterLocationScreenProps): ReactElement {
  const { isFromSetting, onBackdropPress, isVisible } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const route: any = useRoute();
  const locationRef = useRef(null);
  const textCityRef = useRef(null);
  const isPressedInputRed = useRef(false);
  const [isErrorCountry, setIsErrorCountry] = useState(false);
  const [shouldHideSlider, setShouldHideSlider] = useState(false);
  const opacityViewHandler = route.params ? route.params.opacityViewHandler : null;
  const filters = useSelector((state: RootState) => state.filters);
  const MAX_VALUE = useSelector((state: RootState) => state.app.setting?.FILTER_MAX_DISTANCE || 1000);
  const MIN_VALUE = useSelector((state: RootState) => state.app.setting?.FILTER_MIN_DISTANCE || 100);

  const [maxDistanceSelected, setMaxDistanceSelected] = useState<number[]>([filters?.distance?.max ? filters.distance.max : MIN_VALUE]);
  const [activeSections, setActiveSections] = useState(() => {
    if (filters.hasOwnProperty('location')) {
      const lat = filters.location?.lat || '';
      const lng = filters.location?.lng || '';
      const name = filters.location?.name || '';
      locationRef.current = {
        lat,
        lng,
        name,
        isFromFilter: true,
      };
      textCityRef.current = name;
      return [1];
    }
    return [0];
  });

  const SECTIONS = [
    {
      id: '0',
      title: language('myCurrentLocation'),
    },
    {
      id: '1',
      title: language('otherLocation'),
    },
  ];

  useEffect(() => {
    opacityViewHandler && opacityViewHandler(0);
  }, []);

  const onBackPressed = (): boolean => {
    if (isFromSetting) {
      onBackdropPress && onBackdropPress();
      return false;
    }

    opacityViewHandler && opacityViewHandler(1);
    navigation.canGoBack() && navigation.goBack();
    return true;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onBackPressed);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPressed);
      };
    } else {
      return () => {};
    }
  }, []);

  const resetOnPressed = async () => {
    setActiveSections([0]);
    setMaxDistanceSelected([MAX_VALUE]);
  };

  const sliderValuesOnValuesChange = (values: number[]) => {
    setMaxDistanceSelected(values ? values : [MIN_VALUE]);
  };

  const applyOnPressed = async () => {
    if (activeSections.includes(0)) {
      setLoading(true);
      dispatch(
        setFilterDistance(filters?.distance?.unit || 'Km', maxDistanceSelected[0], {
          onSuccess: () => {
            setLoading(false);
            onBackPressed();
          },
          onFail: () => setLoading(false),
        }),
      );
      dispatch(deleteFilterLocation({}));
    } else {
      if (!locationRef.current || !textCityRef.current) {
        setIsErrorCountry(true);
        return;
      }
      dispatch(
        setFilterDistance(filters?.distance?.unit || 'Km', maxDistanceSelected[0], {
          onSuccess: undefined,
          onFail: undefined,
        }),
      );
      setLoading(true);
      dispatch(
        setFilterLocation(locationRef.current, {
          onSuccess: () => {
            setLoading(false);
            onBackPressed();
          },
          onFail: () => {
            setLoading(false);
            onBackPressed();
          },
        }),
      );
    }
    return;
  };

  const renderRadio = section => {
    if (activeSections.includes(0) && section.id === SECTIONS[0].id) {
      return <RadioCheckedSVG />;
    } else if (activeSections.includes(1) && section.id === SECTIONS[1].id) {
      return <RadioCheckedSVG />;
    }
    return <RadioUnCheckSVG />;
  };

  const renderHeader = section => {
    return (
      <View style={styles.wrapHeader}>
        <Text style={styles.textTitle}>{section.title}</Text>
        {renderRadio(section)}
      </View>
    );
  };

  const customMarker = () => {
    return (
      <View style={styles.customMarker}>
        <View style={styles.thumbCircle} />
      </View>
    );
  };

  const unit = filters.distance?.unit === 'Km' ? 'km' : 'Miles';

  const onPressSearch = (location: any, address: any) => {
    locationRef.current = {
      lat: location?.lat || 0,
      lng: location?.lng || 0,
      name: address,
      isFromFilter: true,
    };
    setIsErrorCountry(false);
  };

  const renderSlider = () => {
    return (
      <>
        <DefaultText {...{ style: styles.textValue }}>{maxDistanceSelected + ' ' + unit}</DefaultText>
        <MultiSlider
          containerStyle={styles.slider}
          values={maxDistanceSelected}
          min={MIN_VALUE}
          max={MAX_VALUE}
          step={1}
          sliderLength={screenWidth - 62}
          customMarker={customMarker}
          onValuesChange={sliderValuesOnValuesChange}
          selectedStyle={styles.inLine}
          trackStyle={styles.trackLine}
          isMarkersSeparated={false}
          allowOverlap={true}
        />
      </>
    );
  };

  const onChangeText = (text: string) => {
    if (isPressedInputRed.current) {
      if (text.length === 0) {
        locationRef.current = null;
      }
      if (isErrorCountry) {
        setIsErrorCountry(false);
      }
      textCityRef.current = text;
    }
  };

  const onFocus = () => {
    isPressedInputRed.current = true;
    setShouldHideSlider(true);
  };

  const onBlur = () => {
    setShouldHideSlider(false);
  };

  const renderContent = _section => {
    if (activeSections.includes(0)) {
      return (
        <View style={styles.wrapFirstSlider}>
          <DefaultText {...{ style: styles.textDistance }}>{language('filterScreen.maximumDistance')}</DefaultText>
          {renderSlider()}
        </View>
      );
    }
    if (activeSections.includes(1)) {
      return (
        <View style={styles.wrapSearch}>
          <MapSearch
            isFromFilter
            textPreviousSearch={filters.hasOwnProperty('location') ? filters.location?.name : ''}
            placeholder={language('cityPostal')}
            onPressSearch={onPressSearch}
            containerStyle={styles.search}
            wrapInputStyle={styles.inputSearch}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <ErrorMessage errorValue={isErrorCountry ? language('alertMessage.EMPTY_CHOOSE_CITY') : ''} />

          {!shouldHideSlider && (
            <>
              <DefaultText {...{ style: styles.textDistance }}>{language('filterScreen.maximumDistance')}</DefaultText>
              {renderSlider()}
            </>
          )}
        </View>
      );
    }
    return null;
  };

  const updateSections = activeSection => {
    if (activeSection.length === 0) return;
    setActiveSections(activeSection);
  };

  const renderBody = () => {
    return (
      <>
        <View style={styles.container}>
          <FilterHeaderView
            leftIcon={isFromSetting ? 'close' : 'back'}
            title={language('location')}
            closeOnPressed={onBackPressed}
            resetOnPressed={resetOnPressed}
          />
          <FilterLineBreak />
          <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={updateSections}
            underlayColor={colors.transparent}
          />
          <FilterBottomView applyOnPressed={applyOnPressed} />
        </View>
      </>
    );
  };

  const renderComponent = () => {
    return (
      <View style={isFromSetting ? styles.rootViewSetting : styles.rootView}>
        {isAndroid ? renderBody() : <KeyboardAvoidingView behavior="position">{renderBody()}</KeyboardAvoidingView>}
        {loading && <ModalLoading isVisible={loading} />}
      </View>
    );
  };

  const onBack = () => {
    onBackdropPress && onBackdropPress();
  };

  if (!isFromSetting) {
    return renderComponent();
  }

  return (
    <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={styles.wrapper}>
      <Pressable onPressOut={onBack}>{renderComponent()}</Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  slider: {
    marginHorizontal: 0,
    alignItems: 'flex-end',
    marginRight: 35,
  },
  customMarker: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inLine: {
    backgroundColor: colors.blue_700,
    height: 5,
  },
  thumbCircle: {
    backgroundColor: colors.white,
    width: 24,
    height: 24,
    margin: 4,
    borderRadius: 12,
    shadowColor: colors.gray_800,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  trackLine: {
    height: 5,
    backgroundColor: colors.gray_200,
  },
  textValue: {
    fontSize: fonts.size.s16,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    color: colors.gray_900,
    marginRight: 30,
  },
  textDistance: {
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    marginLeft: 16,
  },
  textTitle: {
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_900,
  },
  rootView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.transparent,
  },
  rootViewSetting: {
    height: screenHeight,
    justifyContent: 'flex-end',
    backgroundColor: colors.transparent,
  },
  wrapSearch: {
    backgroundColor: colors.gray_50,
    marginTop: 20,
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  search: {
    position: null,
    paddingVertical: 10,
    top: -10,
  },
  inputSearch: {
    borderColor: colors.gray_400,
    width: screenWidth - 35,
    marginRight: 10,
  },
  wrapper: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  wrapFirstSlider: {
    backgroundColor: colors.gray_50,
    marginTop: 21,
    paddingTop: 15,
  },
});

export default memo(FilterLocationScreen);
