import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import ProcessSettingSVG from '@/components/SVG/ProcessSettingSVG';
import { getAuctionsDetailStatusColor, getAuctionWonStatus, getIconAuctions } from '@/shared/auction';

interface Props {
  status: string;
}

export function MyAuctionDetailProcess(props: Props): ReactElement {
  const { status } = props;

  const renderImageInProcess = () => {
    return (
      <View style={styles.wrapImage}>
        <ProcessSettingSVG />
      </View>
    );
  };

  const renderImageComplete = () => {
    const backgroundColor = getAuctionsDetailStatusColor(status);
    return <View style={[styles.wrapImageCompleted, { backgroundColor }]}>{getIconAuctions(status)}</View>;
  };

  const renderLineGray = () => {
    return <View style={styles.lineGray} />;
  };

  const renderDot = () => {
    return <View style={styles.dot} />;
  };

  const renderLine = () => {
    return <View style={styles.line} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapItem}>
        {renderDot()}
        {renderLine()}
        {renderImageInProcess()}
        {renderLineGray()}
        {renderImageComplete()}
      </View>
      <View style={styles.wrapText}>
        <Text style={styles.textDefault} />
        <Text style={styles.textProcess}>{language('inProgress')}</Text>
        <Text style={styles.textCompleted}>{getAuctionWonStatus(status)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderRadius: 16,
  },
  wrapItem: {
    flexDirection: 'row',
    marginHorizontal: 30,
    justifyContent: 'center',
  },
  textDefault: {
    width: '25%',
    textAlign: 'center',
  },
  textCompleted: {
    width: '25%',
    textAlign: 'center',
    fontSize: fonts.size.s12,
    color: colors.gray_last_time,
    fontFamily: fonts.family.PoppinsRegular,
  },
  textProcess: {
    width: '44%',
    textAlign: 'center',
    fontSize: fonts.size.s12,
    color: colors.gray_last_time,
    fontFamily: fonts.family.PoppinsRegular,
  },
  wrapText: {
    flexDirection: 'row',
    marginTop: 8,
  },
  wrapImage: {
    alignSelf: 'center',
    padding: 7,
    marginHorizontal: 2,
    backgroundColor: colors.green_beta,
    borderRadius: 20,
  },
  wrapImageCompleted: {
    alignSelf: 'center',
    padding: 7,
    marginHorizontal: 2,
    backgroundColor: colors.gray_400,
    borderRadius: 20,
  },
  line: {
    height: 1,
    width: '30%',
    marginTop: 16,
    backgroundColor: colors.green_line,
  },
  lineGray: {
    height: 1,
    width: '30%',
    marginTop: 16,
    backgroundColor: colors.gray_400,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: colors.green_beta,
    borderRadius: 10,
    marginRight: 2,
    marginTop: 12,
  },
});
