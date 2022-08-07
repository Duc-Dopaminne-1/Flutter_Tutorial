import React from 'react';
import {Text, View} from 'react-native';

import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {dateToString} from '../../../../utils/TimerCommon';
import styles from './styles';

type ArticleHeaderProps = {
  title: string,
  articleType: string,
  createdDatetime: string,
};

const ArticleHeader = ({title, articleType, createdDatetime}: ArticleHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={[METRICS.smallMarginTop, HELPERS.rowStartCenter]}>
        <Text style={styles.articleType}>{articleType}</Text>
        <Text style={styles.date}> • {dateToString(createdDatetime)}</Text>
      </View>
    </View>
  );
};

export default ArticleHeader;
