import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  InteractionManager,
  Linking,
  // eslint-disable-next-line react-native/split-platform-components
  PermissionsAndroid,
  Platform,
  StyleSheet,
  // eslint-disable-next-line react-native/split-platform-components
  ToastAndroid,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { MapSearch } from '@/screens/Map/component/MapSearch';
import MapAddress from '@/screens/Map/component/MapAddress';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { searchCity, searchNearPlace } from '@/redux/auction/actions';
import { SEARCH_NEAR_PLACE_MAP, TYPE_DISTANCE } from '@/constants/app';
import { GlobalProps } from '@/shared/Interface';
import { STATUSBAR_HEIGHT } from '@/components/SafeArea';
import store from '@/redux/store';
import MapMarker from '@/screens/Map/component/MapMarker';
import { isAndroid, isIOS } from '@/shared/devices';
import MapIcon from '@/screens/Map/component/MapIcon';
import MapName from '@/screens/Map/component/MapName';
import { DevENV } from '@/shared/processing';
import { language } from '@/i18n';
import { mapService } from '@/shared/Map';
import { RESULTS } from 'react-native-permissions';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import IconBack from '@/components/SVG/BackSvg';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const LATITUDE_DELTA_ZOOM_IN = 0.01;
const LONGITUDE_DELTA_ZOOM_IN = 0.01;
const LATITUDE_DELTA = 0.035;
const RATIO = 42000;
const MAX_PLACE = 15;
const LONGITUDE_DELTA = LATITUDE_DELTA * (deviceWidth / deviceHeight);
let dMax = 1;
let address = '';
let addressState = '';
let isPressMarker = false;
let viaNearPointsLocal = [];

export const MapScreen: (props: GlobalProps) => ReactElement = (props: GlobalProps) => {
  const onSetAddress = props.route.params ? props.route.params?.onSetAddress : () => undefined;
  const isFromCity = props.route.params ? props.route.params?.isFromCity : false;
  const title = props.route.params ? props.route.params?.title : '';
  const titleButton = props.route.params ? props.route.params?.titleButton : '';
  const latitudeDefault = 38.89959904967494;
  const longitudeDefault = -77.03695772720414;
  const placeIdRef = useRef<string>('');
  const countryRef = useRef<string>('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const _mapRef = useRef(null);
  const [addressMain, setAddressMain] = useState('');
  const [country, setCountry] = useState('');
  const [isShowName, setIsShowName] = useState(false);
  const [state, setState] = useState({
    latitude: latitudeDefault,
    longitude: longitudeDefault,
    error: null,
    via_Points: [],
    viaNearPoints: [],
  });

  useEnableHardwareBackButton();

  useEffect(() => {
    resetDataLocal();
    InteractionManager.runAfterInteractions(() => {
      getLocationUpdates();
    });
  }, []);

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert(language('errorMessage.unableSettings'));
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === RESULTS.GRANTED) {
      return true;
    }

    if (status === RESULTS.DENIED) {
      Alert.alert(language('permissionDenied'));
    }

    if (status === 'disabled') {
      Alert.alert(language('turnOnLocation'), '', [
        { text: language('yes'), onPress: openSetting },
        { text: language('no'), onPress: () => {} },
      ]);
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return await hasPermissionIOS();
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(language('permissionDenied'), ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(language('permissionRevoked'), ToastAndroid.LONG);
    }

    return false;
  };

  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return null;
    }

    localCurrentPosition();
  };

  const resetDataLocal = () => {
    addressState = '';
    address = '';
    viaNearPointsLocal.length = 0;
  };

  const removeAccents = str => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const getCity = (latitude: number, longitude: number) => {
    if (isFromCity) {
      dispatch(
        searchCity({
          lat: latitude,
          long: longitude,
          onSuccess: data => {
            if (data.results.length > 0) {
              const result = mapService.getOnlyCity(data.results);
              countryRef.current = result.country;
              if (result.hasOwnProperty('city') && result.hasOwnProperty('state')) {
                address = `${removeAccents(result.city)}, ${result.state}, ${result.country}`;
                addressState = removeAccents(result.city);
              } else if (result.hasOwnProperty('state')) {
                address = `${result.state}, ${result.country}`;
                addressState = removeAccents(result.state);
              } else if (result.hasOwnProperty('city')) {
                address = `${removeAccents(result.city)}, ${result.country}`;
                addressState = removeAccents(result.city);
              }
            }
          },
        }),
      );
      animateToRegion(latitude, longitude, LATITUDE_DELTA_ZOOM_IN, LONGITUDE_DELTA_ZOOM_IN);
    }
  };

  const onMapViewPress = async e => {
    if (isPressMarker) {
      return;
    }
    const { latitude, longitude } = e.nativeEvent.coordinate;
    resetDataLocal();
    // get City
    getCity(latitude, longitude);
    // get around place
    searchAroundPlace(latitude, longitude);

    setState(prev => {
      return {
        ...prev,
        viaNearPoints: [],
        via_Points: [{ latitude: latitude, longitude: longitude }],
      };
    });
  };

  const handleDistance = (p1, p2) => {
    if (!p1 || !p2) return 0;
    let R = 6371000; // Radius of the Earth in m
    let dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    let dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat * Math.PI) / 180) * Math.cos((p2.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let d = R * c;
    return d;
  };

  const setAroundPlace = (latitude: number, longitude: number, pageToken = '', initCoffee: boolean) => {
    const { distance } = store.getState().filters;
    const radius = distance && distance.unit == TYPE_DISTANCE ? distance.max * 1000 : distance.max * 1609;

    if (mapService.getCoffeesLength() > 0 && initCoffee) {
      animateToRegion(latitude, longitude, mapService.getDMax() / RATIO, mapService.getDMax() / RATIO);
      // }

      setState(prev => {
        return {
          ...prev,
          viaNearPoints: mapService.getCoffees(),
        };
      });
      return;
    }

    dispatch(
      searchNearPlace({
        lat: latitude,
        long: longitude,
        radius,
        type: SEARCH_NEAR_PLACE_MAP,
        pageToken,
        onSuccess: data => {
          // filter distance based in discovery setting
          data.results.map(item => {
            const d = handleDistance({ lat: latitude, lng: longitude }, item.geometry.location);
            if (d < radius) {
              if (viaNearPointsLocal.length < MAX_PLACE) {
                dMax = d;
                viaNearPointsLocal.push(item);
              }
            }
          });
          // if (data.hasOwnProperty('next_page_token') && viaNearPointsLocal.length < MAX_PLACE) {
          //   setTimeout(() => {
          //     setAroundPlace(latitude, longitude, data.next_page_token);
          //   }, 2000);
          // }
          // if (viaNearPointsLocal.length <= 20) {
          animateToRegion(latitude, longitude, dMax / RATIO, dMax / RATIO);
          // }

          setState(prev => {
            return {
              ...prev,
              viaNearPoints: viaNearPointsLocal,
            };
          });
        },
        onFail: (_err: string) => {},
      }),
    );
  };

  const searchAroundPlace = (latitude: number, longitude: number, initCoffee = false) => {
    if (!isFromCity) {
      setAroundPlace(latitude, longitude, '', initCoffee);
    }
  };

  const onMapViewPoiClick = async e => {
    const { coordinate, name } = e.nativeEvent;
    const lat = coordinate ? coordinate.latitude : 0;
    const long = coordinate ? coordinate.longitude : 0;
    // just take the position near from auction
    resetDataLocal();
    if (DevENV()) {
      address = name;
    } else {
      address = '';
      addressState = '';
    }
    await searchAroundPlace(lat, long);
    // get City
    getCity(lat, long);
    setState(prev => {
      return {
        ...prev,
        via_Points: [{ latitude: lat, longitude: long }],
      };
    });
  };

  const onRegionChange = (data: any) => {
    if (data.latitudeDelta > 0.017 && data.longitudeDelta > 0.009) {
      if (isShowName) {
        setIsShowName(false);
      }
    } else {
      if (!isShowName) {
        setIsShowName(true);
      }
    }
    setCountry(countryRef.current);
    setAddressMain(address);
  };

  const onMapReady = () => {
    let { latitude, longitude } = state;
    if (!!state.via_Points && state.via_Points.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      latitude = state.via_Points[0].latitude;
      // eslint-disable-next-line prefer-destructuring
      longitude = state.via_Points[0].longitude;
    }
    animateToRegion(latitude, longitude);
  };

  const localCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setState(prev => {
          return {
            ...prev,
            latitude: latitude,
            longitude: longitude,
            via_Points: [{ latitude: latitude, longitude: longitude }],
            error: null,
          };
        });

        animateToRegion(latitude, longitude, LATITUDE_DELTA_ZOOM_IN, LONGITUDE_DELTA_ZOOM_IN);
        getCity(latitude, longitude);
        // get around place
        searchAroundPlace(latitude, longitude, true);
      },
      _error => {
        setState(prev => {
          return {
            ...prev,
            latitude: latitudeDefault,
            longitude: longitudeDefault,
            error: null,
          };
        });
        animateToRegion(latitudeDefault, longitudeDefault);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    );
  };

  const animateToRegion = (latitude, longitude, latitudeDelta = LATITUDE_DELTA_ZOOM_IN, longitudeDelta = LATITUDE_DELTA_ZOOM_IN) => {
    InteractionManager.runAfterInteractions(() => {
      if (_mapRef && _mapRef.current && _mapRef.current.animateToRegion) {
        _mapRef.current.animateToRegion(
          {
            latitude: !!latitude ? latitude : state.latitude,
            longitude: !!longitude ? longitude : state.longitude,
            latitudeDelta: !!latitudeDelta ? latitudeDelta : LATITUDE_DELTA,
            longitudeDelta: !!longitudeDelta ? longitudeDelta : LONGITUDE_DELTA,
          },
          1000,
        );
      }
    });
  };

  const onPressSearch = (_data: any, details: any) => {
    const {
      geometry: {
        location: { lat, lng },
      },
    } = details;

    resetDataLocal();
    // get City
    getCity(lat, lng);
    // get around place
    searchAroundPlace(lat, lng);

    setState(prev => {
      return {
        ...prev,
        via_Points: [{ latitude: lat, longitude: lng }],
      };
    });
    animateToRegion(lat, lng, LATITUDE_DELTA_ZOOM_IN, LONGITUDE_DELTA_ZOOM_IN);
  };

  const onPressAddAddress = useCallback(() => {
    const { via_Points } = state;

    onSetAddress &&
      onSetAddress({
        state: addressState,
        country,
        addressMain,
        via_Points,
        placeId: placeIdRef.current,
      });
    navigation.goBack();
  }, [addressMain]);

  const onMakerPress = e => {
    isPressMarker = true;
    const {
      geometry: {
        location: { lat, lng },
      },
      name,
      vicinity,
    } = e;

    placeIdRef.current = e.place_id;
    address = `${name}, ${vicinity}`;
    setState(prev => {
      return {
        ...prev,
        via_Points: [{ latitude: lat, longitude: lng }],
      };
    });
    animateToRegion(lat, lng, LATITUDE_DELTA_ZOOM_IN, LONGITUDE_DELTA_ZOOM_IN);
    setTimeout(() => {
      isPressMarker = false;
    }, 200);
  };

  return (
    <View style={styles.container}>
      {!!state.latitude && !!state.longitude && (
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          ref={_mapRef}
          style={styles.map}
          initialRegion={{
            latitude: state.latitude,
            longitude: state.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          showsMyLocationButton={false}
          zoomEnabled={true}
          zoomTapEnabled={true}
          onPress={e => onMapViewPress(e)}
          onPoiClick={e => onMapViewPoiClick(e)}
          onRegionChange={data => onRegionChange(data)}
          onMapReady={() => onMapReady()}
          showsUserLocation
        >
          {!!state.via_Points &&
            state.via_Points.length > 0 &&
            state.via_Points.map((point, index) => {
              return (
                <Marker
                  style={styles.wrapPoint}
                  key={point.latitude + index.toString()}
                  coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                />
              );
            })}
          {!!state.viaNearPoints &&
            state.viaNearPoints.length > 0 &&
            state.viaNearPoints.map((point, index) => {
              return (
                <MapMarker
                  isshow={isShowName}
                  key={point.geometry.location.lat + index.toString()}
                  coordinate={{ latitude: point.geometry.location.lat, longitude: point.geometry.location.lng }}
                  onPress={_e => onMakerPress(point)}
                >
                  <MapIcon />
                  {isShowName ? <MapName name={point.name} /> : null}
                </MapMarker>
              );
            })}
        </MapView>
      )}

      <CustomHeader leftIcon={<IconBack />} title={title} titleStyle={styles.textTitle} containerStyle={styles.wrapTitle} />

      <MapSearch onPressSearch={onPressSearch} />

      <MapAddress titleButton={titleButton} onPressAddAddress={onPressAddAddress} address={addressMain} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  map: {
    flex: 1,
  },
  wrapTitle: {
    backgroundColor: colors.white,
    width: '100%',
    position: 'absolute',
    paddingTop: isIOS ? STATUSBAR_HEIGHT : STATUSBAR_HEIGHT + 7,
    paddingBottom: isAndroid ? 8 : 5,
  },
  textTitle: {
    fontSize: fonts.size.s16,
    color: colors.title_grey,
    fontFamily: fonts.family.PoppinsBold,
    marginTop: 3,
  },
  wrapPoint: {
    zIndex: 999,
  },
});
