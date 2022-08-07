import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import ModalPopup from '../../../components/Modal/ModalPopup';
import {useLogin} from '../../Auth/useLogin';
import ReportPost from '../Contact/ReportPost/ReportPost';
import styles from './styles';

const viewStyle = StyleSheet.create({
  viewReport: {flexDirection: 'row', alignItems: 'center'},
  icon: {width: 24, height: 24},
});

const ModalReport = ({propertyPostId, showPopupReport, setShowPopupReport, setReported}) => {
  if (!showPopupReport) {
    return null;
  }
  return (
    <ModalPopup
      contentContainerStyle={[METRICS.resetPadding, styles.reportPopup]}
      visible={showPopupReport}
      onPressOutSide={() => setShowPopupReport(false)}
      animationType="slide"
      avoidKeyboard={true}>
      <ReportPost
        onPressClose={() => setShowPopupReport(false)}
        propertyPostId={propertyPostId}
        onReportSuccess={() => setReported(true)}
      />
    </ModalPopup>
  );
};
// const ReportButton = ({reported, onPress}) => {
//   return (
//     <CustomButton
//       title={translate(reported ? STRINGS.REPORTED_POST : STRINGS.REPORT_POST)}
//       iconName={'flag-variant-outline'}
//       iconColor={COLORS.GREY_CB}
//       iconSize={16}
//       style={[commonStyles.buttonOutline, styles.buttonReport]}
//       titleStyle={styles.buttonReportText}
//       onPress={onPress}
//       disabled={reported}
//     />
//   );
// };
export const ReportFeature = ({propertyPostId, initReported}) => {
  const [showPopupReport, setShowPopupReport] = useState(false);
  const {showLogin} = useLogin();
  const [reported, setReported] = useState(initReported);

  const onPressReportButton = () => {
    showLogin(() => {
      propertyPostId && !reported && setShowPopupReport(true);
    });
  };

  return (
    <>
      {/* <ReportButton reported={reported} onPress={onPressReportButton} /> */}
      <TouchableOpacity
        disabled={reported}
        onPress={onPressReportButton}
        style={viewStyle.viewReport}>
        <Image style={viewStyle.icon} source={IMAGES.IC_REPORT} resizeMode="contain" />
        <View style={commonStyles.separatorColumn12} />
        <Text style={{...FONTS.regular, color: COLORS.BLACK_31}}>{translate('common.report')}</Text>
      </TouchableOpacity>
      <ModalReport
        propertyPostId={propertyPostId}
        showPopupReport={showPopupReport}
        setShowPopupReport={setShowPopupReport}
        setReported={setReported}
      />
    </>
  );
};
