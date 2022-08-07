import React, { ReactElement } from 'react';
import { ImageStyle, Image, TextStyle, View, ViewStyle } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { fonts } from '@/vars';
import { language } from '@/i18n';
import { SafeArea } from '@/components/SafeArea';
import ReactNativeZoomAbleView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import { useRoute } from '@react-navigation/native';
import IconBack from '@/components/SVG/BackSvg';

const ROOT: ViewStyle = {
  flex: 1,
};

const CONTAINER: ViewStyle = {
  flex: 1,
};

const WRAP_IMAGE: ViewStyle = {
  padding: 10,
};

const IMAGE: ImageStyle = { flex: 1, width: null, height: '100%' };

const WRAPPER_HEADER: ViewStyle = {
  marginBottom: 20,
};

const TITLE: TextStyle = {
  fontSize: fonts.size.s20,
  fontFamily: fonts.family.SSPSemiBold,
};

export function ProfileEditViewImage(): ReactElement {
  const route: any = useRoute();
  const uri = route ? route.params?.uri : '';

  return (
    <View style={ROOT}>
      <SafeArea />
      <View style={WRAPPER_HEADER}>
        <CustomHeader titleStyle={TITLE} title={language('view')} leftIcon={<IconBack />} />
      </View>
      <View style={CONTAINER}>
        <ReactNativeZoomAbleView maxZoom={1.5} minZoom={0.5} zoomStep={0.5} initialZoom={1} bindToBorders={true} style={WRAP_IMAGE}>
          <Image style={IMAGE} source={{ uri }} resizeMode="contain" />
        </ReactNativeZoomAbleView>
      </View>
    </View>
  );
}
