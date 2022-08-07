import { ICCollapse, ICExpand } from '../assets/icons';
import Heading from '../components/text/heading';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../constants/colors';
import { BORDER_RADIUS, SPACING } from '../constants/size';
import { Shadow } from '../constants/stylesCSS';
import React, { useCallback, useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import themeContext from '../constants/theme/themeContext';

const ExpandView = ({
  children,
  collapseChildren,
  style,
  contentStyle,
  title,
  center = false,
  canExpand = true,
  expanded = true,
  translateTitle = false
}) => {
  const theme = useContext(themeContext);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const onPress = useCallback(() => {
    if (canExpand) {
      setIsExpanded(prevState => !prevState);
    }
  }, [canExpand]);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={[styles.titleContainer]} onPress={onPress} activeOpacity={0.8}>
        {title ? (
          <Heading
            color={theme.text.primary}
            translate={translateTitle}
            style={
              center
                ? {
                    width: '100%',
                    paddingHorizontal: SPACING.Medium,
                    textAlign: 'center'
                  }
                : { width: '92%' }
            }>
            {title}
          </Heading>
        ) : (
          <View />
        )}
        {canExpand ? (
          <View style={styles.toggle}>{isExpanded ? <ICCollapse /> : <ICExpand />}</View>
        ) : (
          <View style={styles.toggle} />
        )}
      </TouchableOpacity>
      <View style={[styles.contentContainer, contentStyle]}>
        {isExpanded ? children : collapseChildren}
      </View>
    </View>
  );
};

export default React.memo(ExpandView);

const styles = StyleSheet.create({
  container: {
    ...Shadow,
    backgroundColor: BACKGROUND_COLOR.Primary,
    padding: SPACING.Medium,
    borderRadius: BORDER_RADIUS
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  toggle: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  contentContainer: {}
});
