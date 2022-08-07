import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { WIDTH } from '@src/constants/vars';

const paddingLeft = 14;
const widthFilterButton = (WIDTH - 14 * 3) / 3;

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
    height: 46,
    paddingHorizontal: paddingLeft,
    backgroundColor: Theme.deliveries.contentBackground,
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  tenantImage: {
    height: 17,
    width: 17,
  },
  tenantText: {
    marginLeft: 7,
    color: Theme.tenant.button,
  },
  lineContainer: {
    flexDirection: 'row',
    marginHorizontal: paddingLeft,
  },
  line: {
    width: WIDTH - paddingLeft * 2,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.deliveries.contentBackground,
  },
  filterWidth: {
    width: widthFilterButton,
  },
});

export default styles;
