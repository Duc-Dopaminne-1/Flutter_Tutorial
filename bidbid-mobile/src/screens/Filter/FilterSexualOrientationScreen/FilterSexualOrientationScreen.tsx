import React, { ReactElement, useEffect, useState, memo } from 'react';
import { View, ViewStyle, ScrollView, Platform, BackHandler } from 'react-native';
import { colors } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { language } from '@/i18n';

import { FilterHeaderView } from '../Commons/FilterHeaderView';
import { FilterLineBreak } from '../Commons/FilterLineBreak';
import { FilterBodyView } from '../Commons/FilterBodyView';
import { FilterBottomView } from '../Commons/FilterBottomView';

import FilterSexualOrientationItem from './components/FilterSexualOrientationItem';

import { SEXUAL_ORIENTATION_MODEL } from '@/models/sexual-orirentation';
import { getFilterSexualOrientation, setFilterSexualOrientation } from '@/redux/filters/actions';
import Modal from 'react-native-modal';
import { filterSexualOrientationSelector, getFilter } from '@/redux/filters/selector';
// import NavigationActionsService from '@/navigation/navigation';
import ModalLoading from '@/components/ModalLoading';

const ROOT_VIEW: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: colors.transparent,
};

const ROOT_VIEW_SETTING: ViewStyle = {
  backgroundColor: colors.transparent,
};

const CONTAINER: ViewStyle = {
  backgroundColor: colors.white,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: 30,
};

const WRAP_MODAL: ViewStyle = {
  margin: 0,
  justifyContent: 'flex-end',
};

// const MAX_SELECT = 3;

interface FilterSexualOrientationScreenProps {
  isFromSetting?: boolean;
  onBackdropPress?: () => void;
  isVisible?: boolean;
}

function FilterSexualOrientationScreen(props: FilterSexualOrientationScreenProps): ReactElement {
  const { isFromSetting, onBackdropPress, isVisible } = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route: any = useRoute();

  const opacityViewHandler = route.params ? route.params.opacityViewHandler : null;
  const [loading, setLoading] = useState(false);
  const sexualOrientationList = getFilter().data?.sexualOrientationsList || [];
  const sexualOrientationSelectedDefault = filterSexualOrientationSelector() || [];

  const [sexualOrientationSelected, setSexualOrientationSelected] = useState([]);

  useEffect(() => {
    if (sexualOrientationList.length < 1) {
      dispatch(getFilterSexualOrientation({}));
    }
  }, [sexualOrientationList]);

  useEffect(() => {
    opacityViewHandler && opacityViewHandler(0);
  }, []);

  useEffect(() => {
    setSexualOrientationSelected(sexualOrientationSelectedDefault);
  }, [sexualOrientationSelectedDefault]);

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
    setSexualOrientationSelected([]);
  };

  const sexualOrientationOnPressed = async (item: SEXUAL_ORIENTATION_MODEL) => {
    let newArray = [...sexualOrientationSelected];
    if (checkIsSelected(item)) {
      newArray = sexualOrientationSelected.filter(itemSelected => itemSelected.id !== item.id);
    } else {
      newArray.push(item);
    }
    setSexualOrientationSelected(newArray);
  };
  const onSuccessHandler = () => {
    setLoading(false);
    onBackPressed();
  };

  const onFailedHandler = () => {
    setLoading(false);
    onBackPressed();
  };
  const applyOnPressed = async () => {
    if (isFromSetting) {
      setLoading(true);
    }
    if (sexualOrientationSelected && sexualOrientationSelected.length > 0) {
      const sexualOrientations = sexualOrientationSelected.map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      });

      dispatch(
        setFilterSexualOrientation(sexualOrientations, {
          onSuccess: onSuccessHandler,
          onFail: onFailedHandler,
        }),
      );
    } else {
      dispatch(
        setFilterSexualOrientation([], {
          onSuccess: onSuccessHandler,
          onFail: onFailedHandler,
        }),
      );
    }
  };

  const checkIsSelected = (sexualOrientation: SEXUAL_ORIENTATION_MODEL) => {
    let isSelected = false;
    sexualOrientationSelected.map(item => {
      if (item.id === sexualOrientation.id) isSelected = true;
    });
    return isSelected;
  };

  const renderBody = () => {
    return (
      <View style={isFromSetting ? ROOT_VIEW_SETTING : ROOT_VIEW}>
        <View style={CONTAINER}>
          <FilterHeaderView
            leftIcon={isFromSetting ? 'close' : 'back'}
            title={language('filterScreen.sexualOrientation')}
            closeOnPressed={onBackPressed}
            resetOnPressed={resetOnPressed}
          />
          <FilterLineBreak />
          <FilterBodyView>
            <ScrollView showsVerticalScrollIndicator={false}>
              {sexualOrientationList.map(sexualOritentionItem => {
                return (
                  <FilterSexualOrientationItem
                    key={sexualOritentionItem.id.toString()}
                    sexualOrientation={sexualOritentionItem}
                    listSelected={sexualOrientationSelected}
                    onPressed={sexualOrientationOnPressed}
                  />
                );
              })}
            </ScrollView>
          </FilterBodyView>
          <FilterBottomView applyOnPressed={applyOnPressed} />
        </View>
      </View>
    );
  };

  const onBack = () => {
    // setDataSelectTemp(dataSelectedList);
    setSexualOrientationSelected([...sexualOrientationSelectedDefault]);
    onBackdropPress && onBackdropPress();
  };

  if (!isFromSetting) {
    return renderBody();
  }
  return (
    <>
      <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={WRAP_MODAL}>
        {renderBody()}
        {loading && <ModalLoading isVisible={loading} />}
      </Modal>
    </>
  );
}

export default FilterSexualOrientationScreen;
