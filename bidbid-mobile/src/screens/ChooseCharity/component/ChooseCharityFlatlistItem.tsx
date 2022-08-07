import React, { ReactElement } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import ChooseCharityFlatListItemTick from '@/screens/ChooseCharity/component/ChooseCharityFlatlistItemTick';
import ChooseCharityFlatlistItemLogo from '@/screens/ChooseCharity/component/ChooseCharityFlatlistItemLogo';
import { Charities } from '@/redux/auction';

interface Prop {
  item: Charities;
  idSelected: number;
  onSetSelect?: (id: number) => void;
}
function ChooseCharityFlatListItem(props: Prop): ReactElement {
  const { idSelected, onSetSelect, item } = props;

  const { name, address, id } = item;

  const onPress = () => {
    onSetSelect(id);
  };

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <ChooseCharityFlatListItemTick isCheck={idSelected === id} />
      <ChooseCharityFlatlistItemLogo name={name} city={`${!!address ? `${address}` : ''}`} />
    </Pressable>
  );
}

export default React.memo(ChooseCharityFlatListItem);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 12,
  },
});
