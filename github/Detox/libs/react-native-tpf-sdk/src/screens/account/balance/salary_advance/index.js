import PrimaryButton from '../../../../components/primary_button';
import SCREENS_NAME from '../../../../constants/screens';
import { SPACING } from '../../../../constants/size';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import MenuSection from '../../../../screens/account/components/memu_section';
import MenuCard from '../../../../screens/account/components/menu_card';
import { styles } from './styles';

const userData = {
  name: 'Dao bao duy',
  advanceSalaryLevel: 10000000,
  advanceSalary: 5000000
};
const SalaryAdvance = props => {
  const { navigation } = props;
  return (
    <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
      <View style={{ flex: 1 }}>
        <MenuSection>
          <MenuCard
            translate
            title={'advance_salary.advance_salary_level'}
            content={userData.advanceSalaryLevel}
          />
        </MenuSection>
        <MenuSection>
          <MenuCard
            translate
            title={'advance_salary.input_advance_salary'}
            content={userData.advanceSalary}
          />
        </MenuSection>
        <MenuSection>
          <MenuCard
            translate
            title={'advance_salary.advance_fee'}
            rightContent
            content={userData.advanceSalary * 0.01}
          />
        </MenuSection>
        <View
          style={{
            paddingHorizontal: SPACING.Medium,
            marginTop: SPACING.Medium * 2
          }}>
          <PrimaryButton
            translate
            onPress={() => {
              navigation.navigate(SCREENS_NAME.CONFIRM_ADVANCE_SALARY_SCREEN);
            }}
            title={'advance_salary.continue'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SalaryAdvance;
