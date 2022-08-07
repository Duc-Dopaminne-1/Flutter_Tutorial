import React from 'react';
import styles from './styles';
import { ICNextGreen } from '../../../../assets/icons';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HighlightButton from '../../../../components/highlight_button';
import CardProducts from '../card_products';
import AppText from '../../../../components/app_text';

const OtherProducts = props => {
  const navigation = useNavigation();
  const renderItem = ({ item, index }) => {
    return <CardProducts />;
  };

  const keyExtractor = (item, index) => index + '';
  const onPress = () => {
    navigation.navigate('ListTypesInsurance', { title: 'insurance_screen.home_insurance' });
  };

  return (
    <View style={styles.otherProductsWrapper}>
      <View style={styles.titleWrapper}>
        <AppText translate bold={true} style={styles.otherProductsTitle}>
          {'insurance_screen.home_insurance'}
        </AppText>
        <HighlightButton onPress={onPress} iconRight={<ICNextGreen />} style={styles.showAllBtn}>
          <AppText translate bold={true} style={styles.showAllText}>
            {'common.show_all'}
          </AppText>
        </HighlightButton>
      </View>
      <FlatList
        horizontal
        data={[1, 2, 3]}
        renderItem={renderItem}
        style={styles.otherList}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

OtherProducts.propTypes = {
  // bla: PropTypes.string,
};

OtherProducts.defaultProps = {
  // bla: 'test',
};

export default OtherProducts;
