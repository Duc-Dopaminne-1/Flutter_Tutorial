import React, { ReactElement, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { language } from '@/i18n';
import { FILTER_GENERAL_SCREEN } from '@/navigation/screenKeys';
import CustomHeader from '@/components/CustomHeader';
import { useSelector } from 'react-redux';
import { onClickIconFilter, TouchDiscovery } from '@/shared/global';
import { TutorialState } from '@/redux/tutorial/reducer';
import { getStatusFirstInstall } from '@/redux/app/selector';
import { vs } from '@/vars/scaling';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FilterSvg from '@/components/SVG/FilterSVG';

function HomeHeader(): ReactElement {
  const navigation = useNavigation();
  const index = useSelector((state: TutorialState) => state.tutorial.index);
  const insets = useSafeAreaInsets();

  const onPressFilter = () => {
    if (getStatusFirstInstall()) {
      index === 4 && onClickIconFilter.next(TouchDiscovery.Back);
      return;
    }
    navigation.navigate(FILTER_GENERAL_SCREEN);
  };

  return (
    <View>
      <View style={styles.container}>
        <CustomHeader
          isShadow={false}
          containerStyle={StyleSheet.flatten([styles.wrapHeader, insets.top > 24 && { paddingTop: 10 }])}
          titleStyle={styles.textHeader}
          title={language('discovery')}
          rightIcon={<FilterSvg />}
          iconColor={colors.gray_900}
          onPressSubIcon={onPressFilter}
        />
      </View>
    </View>
  );
}

export default memo(HomeHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(5),
  },
  wrapHeader: {
    flex: 1,
    paddingHorizontal: 15,
  },
  textHeader: {
    fontSize: fonts.size.s22,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  },
});
