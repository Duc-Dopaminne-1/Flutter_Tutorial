import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import RadioUnCheckSVG from '@/components/SVG/RadioUnCheckSVG';
import RadioCheckedSVG from '@/components/SVG/RadioCheckedSVG';

interface Prop {
  isCheck: boolean;
}

function ChooseCharityFlatListItemTick(props: Prop): ReactElement {
  const { isCheck } = props;

  return <View style={styles.container}>{isCheck ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}</View>;
}

export default React.memo(ChooseCharityFlatListItemTick);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginTop: -12,
  },
});
