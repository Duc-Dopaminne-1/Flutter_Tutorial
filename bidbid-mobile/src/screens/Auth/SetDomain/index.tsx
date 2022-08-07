import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import { TextInputComponent } from '@/components/TextInput';
import { initApp } from '@/services/init';
import { useNavigation } from '@react-navigation/native';

let ip = '';

export function SetDomainScreen(): ReactElement {
  const navigation = useNavigation();

  const onPress = () => {
    initApp(ip);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <TextInputComponent
        onChangeText={text => {
          ip = text;
        }}
        returnKeyType="done"
      />
      <Text onPress={onPress}>SET</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
