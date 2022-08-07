import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale } from '../../../../../utils/responsive';
import { BodyText, Heading, SmallText, SubHead } from '../../../../../components';
import themeContext from '../../../../../constants/theme/themeContext';
import FormInput from './form_input';
const InputStep3 = props => {
  const {
    currentCategory,
    currentPartner,
    setCurrentPartner,
    setCurrentStep,
    setCurrentCategory,
    setSelectionPopup,
    setLoading,
    fromCreateLead
  } = props;
  const theme = useContext(themeContext);
  const handleGoBackStep1 = () => {
    setCurrentStep(1);
    setCurrentCategory(null); // reset category of step 1
    setCurrentPartner(null); // reset partner of step 2
  };
  const handleGoBackStep2 = () => {
    setCurrentStep(2);
    setCurrentPartner(null); // reset category of step 2
  };
  return (
    <View>
      <View style={styles.header}>
        <Heading bold style={{ marginBottom: scale(15) }} translate>
          extra_service_detail.product_and_service
        </Heading>
        <SubHead bold={false} style={{ marginBottom: scale(5) }} translate>
          insurance_screen.products_name
        </SubHead>
        <BodyText bold>{currentCategory?.name || ''}</BodyText>
        <SubHead bold={false} style={{ marginBottom: scale(5), marginTop: scale(5) }} translate>
          screen_name.partner
        </SubHead>
        <BodyText bold>{currentPartner?.partnerName || ''}</BodyText>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.buttonChoose, { borderColor: theme.app.primaryColor1 }]}
            onPress={handleGoBackStep1}>
            <SmallText bold style={{ color: theme.app.primaryColor1 }} translate>
              extra_service_detail.choose_product_again
            </SmallText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonChoose, { borderColor: theme.app.primaryColor1 }]}
            onPress={handleGoBackStep2}>
            <SmallText bold style={{ color: theme.app.primaryColor1 }} translate>
              extra_service_detail.choose_partner_again
            </SmallText>
          </TouchableOpacity>
        </View>
      </View>
      <FormInput
        fromCreateLead={fromCreateLead}
        setSelectionPopup={setSelectionPopup}
        productId={currentPartner?.productId}
        setLoading={setLoading}
      />
    </View>
  );
};
export default React.memo(InputStep3);
const styles = StyleSheet.create({
  container: { paddingHorizontal: scale(0) },
  header: {
    padding: scale(16),
    marginHorizontal: scale(15),
    marginBottom: scale(20),
    borderRadius: scale(6),
    marginTop: 2,
    backgroundColor: '#FFF',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonChoose: {
    height: scale(32),
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(12),
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: scale(4)
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' }
});
