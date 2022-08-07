import NavigationActionsService from '../../navigation/navigation';
import { saveLastLocation } from '@/redux/user/actions';
import Geolocation from 'react-native-geolocation-service';
import { get, set } from '@/services/storage';
import { CURRENT_LOCATION } from '@/constants/app';

class User {
  private location = {
    lat: 0,
    lng: 0,
  };

  setLocation = (lat: number, lng: number) => {
    this.location = {
      lat,
      lng,
    };
  };

  getLocation = () => {
    return this.location;
  };

  saveLocation = (lat: number, lng: number) => {
    this.setLocation(lat, lng);
    NavigationActionsService.dispatchAction(saveLastLocation({ lat: lat.toString(), lng: lng.toString() }));
  };

  localCurrentPosition = async (onSuccess = () => {}, onFail = () => {}) => {
    const getData = await get(CURRENT_LOCATION);
    const getPreviousLocation = JSON.parse(getData);
    if (getPreviousLocation) {
      const { lat, lng } = getPreviousLocation;
      this.saveLocation(lat, lng);
      onSuccess && onSuccess();
    }
    Geolocation.getCurrentPosition(
      async position => {
        const lat: any = position.coords.latitude;
        const lng: any = position.coords.longitude;
        await set(CURRENT_LOCATION, JSON.stringify({ lat, lng }));
        if (!getPreviousLocation) {
          this.saveLocation(lat, lng);
          onSuccess && onSuccess();
        }
      },
      _error => {
        onFail && onFail();
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000,
        distanceFilter: 0,
        showLocationDialog: false,
      },
    );
  };
}

export const userShared = new User();
