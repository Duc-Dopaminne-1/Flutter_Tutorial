import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import themeContext from '../constants/theme/themeContext';
import { ICGreenRightArrow } from '../assets/icons';
import { TEXT_COLOR } from '../constants/colors';
import { SPACING } from '../constants/size';
import Heading from './text/heading';
import SubHead from './text/sub_head';

const ShowAllTitle = props => {
  const theme = useContext(themeContext);
  const { title, titleStyle, onShowAll, enableShowAll, style } = props;
  return (
    <View style={[styles.container, style]}>
      <Heading translate style={[styles.title, titleStyle]} bold>
        {title}
      </Heading>
      {enableShowAll ? (
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={onShowAll}>
          <SubHead color={theme?.app?.primaryColor1} translate style={styles.titleShowAll}>
            common.show_all
          </SubHead>
          <ICGreenRightArrow color1={theme?.icon?.color1} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ShowAllTitle;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  title: {
    flex: 1
  },
  titleShowAll: {
    marginHorizontal: SPACING.XSmall
  }
});
