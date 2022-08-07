import React from 'react';
import { ViewStyle, View, TextStyle, TouchableOpacity } from 'react-native';
import { CELL_ENUM } from './BodyView';
import { colors, fonts } from '@/vars';
import DefaultText from '@/components/CustomText/DefaultText';
import NextSVG from '@/components/SVG/NextSVG';

const CONTAINER: ViewStyle = {
  flex: 1,
  paddingVertical: 8,
  flexDirection: 'row',
  alignItems: 'center',
};

const WRAP_TITLE: ViewStyle = {
  flex: 1,
};

const BOTTOM_VIEW: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s16,
  color: colors.gray_900,
};

const DESCRIPTION: TextStyle = {
  fontSize: fonts.size.s14,
  color: colors.gray_500,
  flex: 1,
  textTransform: 'capitalize',
};

const DESCRIPTION_NORMAL: TextStyle = {
  fontSize: fonts.size.s14,
  color: colors.gray_500,
  flex: 1,
};

interface CellDetailProps {
  title: string;
  description?: string;
  type?: CELL_ENUM;
  onPress?: (type: CELL_ENUM) => void;
  isTextTransform?: boolean;
}

function CellDetail(props: CellDetailProps) {
  const { title, description, type, onPress, isTextTransform = true } = props;
  return (
    <TouchableOpacity style={CONTAINER} onPress={() => onPress(type)}>
      <View style={WRAP_TITLE}>
        <DefaultText {...{ style: TITLE, numberOfLines: 1 }}>{title}</DefaultText>
        <View style={BOTTOM_VIEW}>
          {description && (
            <DefaultText {...{ style: isTextTransform ? DESCRIPTION : DESCRIPTION_NORMAL, numberOfLines: 2, lineBreakMode: 'tail' }}>
              {description}
            </DefaultText>
          )}
        </View>
      </View>
      <NextSVG color={colors.blue_700} />
    </TouchableOpacity>
  );
}

export default React.memo(CellDetail);
