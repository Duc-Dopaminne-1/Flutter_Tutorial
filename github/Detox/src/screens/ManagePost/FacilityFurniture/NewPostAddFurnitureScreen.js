import React from 'react';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import InputSection from '../../../components/InputSection';
import ValidateInput from '../../../utils/ValidateInput';
import NewPostAddItem from './NewPostAddItem';

const NewPostAddFurnitureScreen = ({onPressDismiss, state, onPressConfirm, onPressErase}) => {
  const [item, setItem] = React.useState(state.item);
  return (
    <NewPostAddItem
      onPressDismiss={onPressDismiss}
      item={item}
      disabledConfirm={ValidateInput.isEmpty(item.name)}
      onPressConfirm={onPressConfirm}
      onPressErase={onPressErase}>
      <InputSection
        headerTitle={translate(STRINGS.FURNITURE_NAME)}
        placeholder={translate(STRINGS.FURNITURE_NAME)}
        onChangeText={text => {
          setItem({...item, name: text});
        }}
        value={item.name}
      />
    </NewPostAddItem>
  );
};

export default NewPostAddFurnitureScreen;
