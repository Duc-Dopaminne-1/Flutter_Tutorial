import { getUserId } from '../processing';
import NavigationActionsService from '../../navigation/navigation';
import { setCategories, setCategoriesPlaceABid } from '@/redux/placeABid/actions';

export const savePreviousCategoryBidded = currentAuction => {
  const bids = currentAuction.bids.filter(item => item.creatorId === getUserId());
  if (bids.length > 0) {
    const { categories } = bids[bids.length - 1];
    const category = categories.length > 0 ? categories[0] : '';
    const indexCategorySelected = currentAuction.categories.findIndex(item => item.name === category);
    const idCategorySelected = currentAuction.categories[indexCategorySelected].id;
    NavigationActionsService.dispatchAction(setCategories([idCategorySelected]));
    NavigationActionsService.dispatchAction(setCategoriesPlaceABid([idCategorySelected]));
    return idCategorySelected;
  } else {
    NavigationActionsService.dispatchAction(setCategoriesPlaceABid([]));
    return [];
  }
};
