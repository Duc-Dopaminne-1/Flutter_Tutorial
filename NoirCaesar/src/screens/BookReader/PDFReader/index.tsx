import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import styles from './styles';
import Pdf from 'react-native-pdf';

interface Props {
  onRef?: (ref: any) => void;
  sourceUri: string;
  onLoadComplete?: (numberOfPages: number) => void;
  onPageChanged?: (currentPage: number) => void;
  onError?: (error: any) => void;
}

const PDFReader = (props: Props) => {
  const { sourceUri, onLoadComplete, onPageChanged, onError } = props;

  return (
    <Pdf
      activityIndicatorProps={{ color: 'red', progressTintColor: 'red' }}
      ref={props.onRef}
      style={styles.container}
      horizontal={true}
      source={{ uri: sourceUri }}
      spacing={0}
      fitPolicy={1}
      enablePaging={true}
      onLoadComplete={onLoadComplete}
      onPageChanged={onPageChanged}
      onError={onError}
    />
  );
};

export default PDFReader;
