import React from 'react';
import { View, ViewStyle } from 'react-native';
import styles from './styles';
import { CustomText } from '../CustomText';

interface Props {
  title: string
  containerStyle?: ViewStyle
  rightComponent?: any,
  showLineBottom?: boolean
}

const RequestDetailItem = (prop: Props) => {
  const { title, rightComponent, showLineBottom = true } = prop;
  return (
    <View style={styles.container}>
      <View style={styles.contents}>
        <CustomText style={styles.title} numberOfLines={1} text={title} />
        {rightComponent ?
          <View style={styles.rightContainer}>
            {rightComponent}
          </View>
          : null}
      </View>
      {showLineBottom ? <View style={styles.line}></View> : null}
    </View>
  );
};

export default RequestDetailItem;
