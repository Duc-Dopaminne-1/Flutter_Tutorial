import React, { useCallback, useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExpandView, SubHead } from '../../../../../components';
import { scale } from '../../../../../utils/responsive';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ICLocation } from '../../../../../assets/icons';
import { DEVICE_WIDTH } from '../../../../../constants/size';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../../../../constants/appFonts';
import themeContext from '../../../../../constants/theme/themeContext';

const MAX_LINE = 3;
const SeeMoreView = ({ text }) => {
  const theme = useContext(themeContext);
  const [showMore, setShowMore] = useState(false);
  const [isSeeMore, setIsSeeMore] = useState(true);
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setIsSeeMore(prevState => !prevState);
  };
  const onTextLayout = useCallback(
    e => {
      if (!showMore) {
        setShowMore(e.nativeEvent.lines.length > MAX_LINE);
        setIsSeeMore(false);
      }
    },
    [showMore]
  );

  return (
    <View>
      <Text
        style={styles.textInfoDetail}
        numberOfLines={isSeeMore ? undefined : MAX_LINE}
        onTextLayout={onTextLayout}>
        {text}
      </Text>
      {showMore && (
        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={toggleNumberOfLines}>
            <SubHead translate color={theme.app.primaryColor1}>
              [{isSeeMore ? 'common.show_less' : 'common.see_more'}]
            </SubHead>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const PartnerMapView = props => {
  const { longitude, latitude } = props;
  return (
    <View style={styles.mapViewContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        mapPadding={{
          top: 0,
          right: 0,
          bottom: -50,
          left: 0
        }}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled
        zoomEnabled
        style={{ flex: 1 }}
        region={{
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121
        }}>
        <Marker
          coordinate={{
            latitude,
            longitude
          }}>
          <ICLocation />
        </Marker>
      </MapView>
    </View>
  );
};
const PartnerInfoDynamicView = props => {
  const { partnerInfo } = props;
  const { longitude, latitude, attributeGroups } = partnerInfo;
  return (
    <View style={styles.container}>
      {attributeGroups?.map(item => (
        <ExpandView
          translateTitle
          style={styles.expandView}
          title={item?.attributeGroupName}
          canExpand={true}>
          {item?.attributes?.map(elem => (
            <View style={{ marginTop: scale(12) }}>
              <SubHead bold={false}>{elem?.attributeName}</SubHead>
              <SeeMoreView text={elem?.attributeValue} />
            </View>
          ))}
        </ExpandView>
      ))}
      <ExpandView
        translateTitle
        style={styles.expandView}
        title={'extra_service_detail.position_map'}
        canExpand={true}>
        <PartnerMapView longitude={longitude} latitude={latitude} />
      </ExpandView>
    </View>
  );
};
export default React.memo(PartnerInfoDynamicView);
const styles = StyleSheet.create({
  mapViewContainer: {
    marginTop: scale(15),
    height: DEVICE_WIDTH / 0.98,
    width: '100%',
    borderRadius: scale(6),
    overflow: 'hidden'
  },
  container: { paddingHorizontal: scale(15) },
  expandView: { marginTop: scale(16) },
  textInfoDetail: {
    fontFamily: FONT_FAMILY.BOLD,
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  }
});
