import { StyleSheet, View } from 'react-native';
import React from 'react';
import GroupList from './group_list';
import Banner from './banner';
import { SPACING } from '../../constants/size';
import { scale } from '../../utils/responsive';
import { FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import AppText from '../app_text';
import { BoldTitle } from '..';

const GroupService = ({ dataInfoService, ...props }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BoldTitle translate={false} style={styles.title}>
          {dataInfoService?.title}
        </BoldTitle>
        <AppText translate={false} style={styles.titleDesc}>
          {dataInfoService?.description}
        </AppText>
      </View>
      <GroupList {...props} />
      <Banner dataInfoService={dataInfoService} />
    </View>
  );
};

export default React.memo(GroupService);

const styles = StyleSheet.create({
  container: { marginVertical: SPACING.XXLarge },
  title: {
    fontSize: scale(24),
    lineHeight: LINE_HEIGHT.Title3,
    marginBottom: SPACING.Medium
  },
  titleDesc: {
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  header: {
    paddingVertical: SPACING.Large
  }
});
