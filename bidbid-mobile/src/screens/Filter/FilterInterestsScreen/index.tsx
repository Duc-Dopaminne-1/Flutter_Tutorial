import React, { ReactElement, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { View, ViewStyle, ScrollView } from 'react-native';
import { colors } from '@/vars';
import { useDispatch } from 'react-redux';
import { language } from '@/i18n';

import { FilterHeaderView } from '../Commons/FilterHeaderView';
import { FilterLineBreak } from '../Commons/FilterLineBreak';
import { FilterBodyView } from '../Commons/FilterBodyView';
import { FilterBottomView } from '../Commons/FilterBottomView';

import FilterInterestsItem from './components/FilterInterestsItem';

import { INTERESTS_MODEL } from '@/models/';
import { setFilterInterests } from '@/redux/filters/actions';
import Modal from 'react-native-modal';
import ModalLoading from '@/components/ModalLoading';

const ROOT_VIEW: ViewStyle = {
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

interface FilterInterestsProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  interestsSelected: any[];
  interestsList: any[];
}

export function FilterInterests(props: FilterInterestsProps): ReactElement {
  const { isVisible, onBackdropPress, interestsSelected = [], interestsList = [] } = props;
  const dispatch = useDispatch();

  const [interestsSelectedTmp, setInterestsSelectedTmp] = useState({});
  const interestsSelectedDefault = useRef({});
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const dictionary = interestsSelected.reduce((dic, currentItem) => {
      dic[currentItem.id] = currentItem;
      return dic;
    }, {});
    interestsSelectedDefault.current = dictionary;
    setInterestsSelectedTmp({ ...dictionary });
  }, [interestsSelected]);

  const onBackPressed = (): boolean => {
    onBackdropPress();
    return true;
  };

  const resetOnPressed = async () => {
    setInterestsSelectedTmp([]);
  };

  const interestsOnPressed = useCallback(
    (item: INTERESTS_MODEL) => {
      if (!interestsSelectedTmp[item.id]) {
        interestsSelectedTmp[item.id] = item;
      } else {
        delete interestsSelectedTmp[item.id];
      }
      setInterestsSelectedTmp({ ...interestsSelectedTmp });
    },
    [interestsSelectedTmp],
  );

  const onSuccessHandler = () => {
    onBackPressed();
    setLoading(false);
  };

  const onFailedHandler = () => {
    setLoading(false);
  };

  const applyOnPressed = async () => {
    setLoading(true);
    const interestsSelected = Object.values(interestsSelectedTmp) || [];

    if (interestsSelected && interestsSelected.length > 0) {
      const interests = (interestsSelected as { id: string; name: string }[]).map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      dispatch(
        setFilterInterests(interests, {
          onSuccess: onSuccessHandler,
          onFail: onFailedHandler,
        }),
      );
    } else {
      dispatch(
        setFilterInterests([], {
          onSuccess: onSuccessHandler,
          onFail: onFailedHandler,
        }),
      );
    }
  };

  const onBack = () => {
    setInterestsSelectedTmp({ ...interestsSelectedDefault.current });
    onBackdropPress && onBackdropPress();
  };

  return (
    <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={WRAP_MODAL}>
      <View style={ROOT_VIEW}>
        <View style={CONTAINER}>
          <FilterHeaderView
            leftIcon="close"
            title={language('filterScreen.interests')}
            closeOnPressed={onBackPressed}
            resetOnPressed={resetOnPressed}
          />
          <FilterLineBreak />
          <FilterBodyView>
            <ScrollView showsVerticalScrollIndicator={false}>
              {interestsList.map(interestsItem => {
                return (
                  <FilterInterestsItem
                    key={interestsItem.id.toString()}
                    interests={interestsItem}
                    isSelected={interestsSelectedTmp[interestsItem.id] ? true : false}
                    onPressed={interestsOnPressed}
                  />
                );
              })}
            </ScrollView>
          </FilterBodyView>
          <FilterBottomView applyOnPressed={applyOnPressed} />
        </View>
      </View>
      {loading && <ModalLoading isVisible={loading} />}
    </Modal>
  );
}
