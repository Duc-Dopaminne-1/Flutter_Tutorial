/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import React, {useRef, useState} from 'react';
import {ScrollView, Text, TouchableOpacity as Button, View} from 'react-native';
import {captureRef} from 'react-native-view-shot';

export const CaptureScrollViewContent = ({children}) => {
  const scrollViewRef = useRef(null);
  const [captureURL, setCaptureURL] = useState(null);

  const onPress = () => {
    captureRef(scrollViewRef, {
      format: 'png',
      quality: 0.8,
    })
      .then(value => {
        setCaptureURL(value);
      })
      .catch(console.error);
  };

  return (
    <>
      <Button testID="captureButton" onPress={onPress}>
        <Text>Capture</Text>
        <Text style={{display: 'none'}} testID="captureURL">
          {captureURL}
        </Text>
      </Button>
      <ScrollView testID="captureScrollView">
        <View style={{backgroundColor: 'white'}} ref={scrollViewRef}>
          {children}
        </View>
      </ScrollView>
    </>
  );
};
