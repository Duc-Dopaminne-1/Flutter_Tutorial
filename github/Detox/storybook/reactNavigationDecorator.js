import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

export const reactNavigationDecorator = story => {
  const Screen = () => story();
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="MyStorybookScreen" component={Screen} options={{header: () => null}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
