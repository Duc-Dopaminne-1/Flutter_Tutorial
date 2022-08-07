import React from 'react';
import styles from './styles';
import Swiper from 'react-native-swiper';
import { View } from 'react-native';
import { ICNextGreen } from '../../../../assets/icons';
import CardProducts from '../card_products';
import HighlightButton from '../../../../components/highlight_button';
import { CUSTOM_COLOR } from '../../../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import AppText from '../../../../components/app_text';

const DATA = [
  {
    key: 1
  },
  {
    key: 2
  },
  {
    key: 3
  },
  {
    key: 4
  },
  {
    key: 5
  }
];

const HighlightInsurance = props => {
  const navigation = useNavigation();
  const renderItem = () =>
    DATA.map(item => {
      return <CardProducts fullWidth key={'HighlightInsurance' + item.key} />;
    });

  const onPress = () => {
    navigation.navigate('ListTypesInsurance', {
      title: 'insurance_screen.highlight_insurance'
    });
  };

  return (
    <View style={styles.highlightInsuranceWrapper}>
      <View style={styles.titleWrapper}>
        <AppText translate bold={true} style={styles.otherProductsTitle}>
          {'insurance_screen.highlight_insurance'}
        </AppText>
        <HighlightButton onPress={onPress} iconRight={<ICNextGreen />} style={styles.showAllBtn}>
          <AppText translate bold={true} style={styles.showAllText}>
            {'common.show_all'}
          </AppText>
        </HighlightButton>
      </View>
      <Swiper
        loop={true}
        autoplay={true}
        dotColor={CUSTOM_COLOR.Iceberg}
        activeDotColor={CUSTOM_COLOR.PersianGreen}
        paginationStyle={styles.paginationStyle}>
        {renderItem()}
      </Swiper>
    </View>
  );
};
HighlightInsurance.propTypes = {
  // bla: PropTypes.string,
};

HighlightInsurance.defaultProps = {
  // bla: 'test',
};

export default HighlightInsurance;
