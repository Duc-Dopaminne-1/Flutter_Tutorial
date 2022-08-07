import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';

import {MAX_LENGTH} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import InputSection from '../../../components/InputSection';
import ValidateInput from '../../../utils/ValidateInput';
import {useMount} from '../../commonHooks';
import NewPostAddItem from './NewPostAddItem';

const styles = StyleSheet.create({
  inputContainer: {
    ...METRICS.verticalMargin,
  },
});

const NewPostAddFacilityScreen = ({onPressDismiss, onAddItemToList}) => {
  const [item, setItem] = React.useState({});
  const [inputFocused, setInputFocused] = React.useState(false);
  const inputRef = useRef();

  useMount(() => {
    //Delay auto focus input
    setTimeout(() => inputRef.current?.focus(), 300);
  });

  const onPressAdd = value => {
    onAddItemToList(value);
  };

  const view = (
    <NewPostAddItem
      onPressDismiss={onPressDismiss}
      popupTitle={translate(STRINGS.ADD_FACILITY)}
      item={item}
      disabledConfirm={ValidateInput.isEmpty(item?.name)}
      onPressConfirm={onPressAdd}>
      <InputSection
        inputRef={inputRef}
        inputStyle={{
          ...styles.inputContainer,
          ...commonStyles.inputBorderWithIcon,
          ...(inputFocused ? {borderColor: COLORS.PRIMARY_A100} : {}),
        }}
        placeholder={translate(STRINGS.INPUT_FACILITY)}
        maxLength={MAX_LENGTH.FACILITY_NAME_INPUT}
        onChangeText={text => {
          setItem({...item, name: text, description: text});
        }}
        value={item?.name}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />
    </NewPostAddItem>
  );
  return view;
};

export default NewPostAddFacilityScreen;
