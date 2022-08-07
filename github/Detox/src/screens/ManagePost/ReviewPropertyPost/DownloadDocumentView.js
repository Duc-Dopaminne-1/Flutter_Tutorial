import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {HELPERS} from '../../../assets/theme/helpers';
import {commonStyles} from '../../../assets/theme/styles';
import styles from './styles';

const DownloadDocumentView = ({document}) => {
  return (
    <View style={[HELPERS.row, HELPERS.crossCenter]}>
      <Image source={IMAGES.IC_DOCUMENT} style={styles.iconDocument} resizeMode="contain" />
      <View style={commonStyles.separatorColumn8} />
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.contractDocumentText}>
          {document || 'Hợp đồng cam kết giao dịch trên TopenLand.pdf'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DownloadDocumentView;
