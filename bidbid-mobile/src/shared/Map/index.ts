import NavigationActionsService from '../../navigation/navigation';
import { searchNearPlace } from '@/redux/auction/actions';
import { SEARCH_NEAR_PLACE_MAP, TYPE_DISTANCE } from '@/constants/app';
import store from '../../redux/store';

class MapService {
  private coffees = [];
  private MAX_PLACE = 15;
  private dMax = 1;

  setCoffees(data: []) {
    this.coffees = data;
  }

  getCoffees() {
    return this.coffees;
  }

  getCoffeesLength() {
    return this.coffees.length;
  }

  handleDistance(p1, p2) {
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
  }

  getRadius = () => {
    const { distance } = store.getState().filters;
    return distance && distance.unit == TYPE_DISTANCE ? distance.max * 1000 : distance.max * 1609;
  };

  getDMax = () => {
    return this.dMax;
  };

  deleteAllCoffees = () => {
    this.coffees.length = 0;
  };

  getCoffeePlace(latitude, longitude) {
    NavigationActionsService.dispatchAction(
      searchNearPlace({
        lat: latitude,
        long: longitude,
        radius: 10000,
        type: SEARCH_NEAR_PLACE_MAP,
        pageToken: '',
        onSuccess: data => {
          data.results.map(item => {
            const d = this.handleDistance({ lat: latitude, lng: longitude }, item.geometry.location);

            if (d < this.getRadius()) {
              if (this.coffees.length < this.MAX_PLACE) {
                this.dMax = d;
                this.coffees.push(item);
              }
            }
          });
        },
        onFail: (_err: string) => {},
      }),
    );
  }

  getOnlyCity(results: any) {
    let storableLocation: any = {};
    for (let ac = 0; ac < results[0].address_components.length; ac++) {
      let component = results[0].address_components[ac];

      if (component.types.includes('sublocality') || component.types.includes('locality')) {
        storableLocation.city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        storableLocation.state = component.short_name;
      }
      if (component.types.includes('country')) {
        storableLocation.country = component.long_name;
        storableLocation.registered_country_iso_code = component.short_name;
      }
    }

    return storableLocation;
  }
}

export const mapService = new MapService();
