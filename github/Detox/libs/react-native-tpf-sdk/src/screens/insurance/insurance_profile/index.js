import React, { useContext } from 'react';
import styles from './styles';
import { View } from 'react-native';
import ASpList from '../components/aSP_list';
import TabViews from '../components/tab_views';
import Utilities from '../components/utilities';
import PrimaryButton from '../../../components/primary_button';
import FilterStatus from '../components/filter_status';
import themeContext from './../../../constants/theme/themeContext';

const InsuranceProfile = props => {
  const [currenntIndex, setCurrentIndex] = React.useState(0);
  const { fonts } = useContext(themeContext) || {};
  const changeTabs = React.useCallback(index => {
    setCurrentIndex(index);
  }, []);

  return (
    <View style={styles.additionalServiceProfilesWrapper}>
      <View style={styles.utilities}>
        <Utilities />
      </View>
      <TabViews currentIndex={currenntIndex} changeTabs={changeTabs} />
      <FilterStatus />
      <ASpList currenntIndex={currenntIndex} insuranceProfile />
      <PrimaryButton
        translate
        style={styles.createBtn}
        titleStyle={[styles.createText, { fontFamily: fonts?.MEDIUM }]}
        title={'insurance_profile.create_profile'}
      />
    </View>
  );
};

InsuranceProfile.propTypes = {
  // bla: PropTypes.string,
};

InsuranceProfile.defaultProps = {
  // bla: 'test',
};

export default InsuranceProfile;
