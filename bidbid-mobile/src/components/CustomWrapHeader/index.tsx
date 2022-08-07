import * as React from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import CustomHeaderTitle from '@/components/CustomHeaderTitle';
import CustomHeader from '@/components/CustomHeader';
import IconBack from '@/components/SVG/BackSvg';
import { WELCOME_SCREEN } from '@/navigation/screenKeys';
import NavigationActionsService from '@/navigation/navigation';

type Props = {
  note?: string;
  isBack?: boolean;
  title?: string;
  titleStyle?: TextStyle;
  noteStyle?: TextStyle;
  subButtonText?: React.ReactElement;
  onPressSubIcon?: () => void;
  onBack?: () => void;
};

export function CustomWrapHeader(props: Props) {
  const { title, note, titleStyle, noteStyle, isBack = true, subButtonText, onPressSubIcon, onBack } = props;

  return (
    <View>
      <CustomHeader
        isShadow={false}
        goBack={onBack}
        leftIcon={isBack ? <IconBack /> : null}
        subButtonText={subButtonText}
        onPressSubIcon={onPressSubIcon}
      />
      <View style={styles.wrapHeader}>
        <CustomHeaderTitle title={title} note={note} titleStyle={titleStyle} noteStyle={noteStyle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapHeader: {
    paddingHorizontal: 15,
    paddingTop: 25,
  },
});
