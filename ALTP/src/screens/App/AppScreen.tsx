import React, { Component, ReactElement } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from '@/redux-saga/saga/rootSaga'
import { allReducers } from '@/redux-saga/reducer'
import { Image, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoadingScreen } from '@/screens/Loading/LoadingScreen'
import { HomeScreen } from '@/screens/Home/HomeScreen'
import { ExamScreen } from '@/screens/Exam/ExamScreen'
import { SignUpScreen } from '@/screens/Login+SignUp/SignUp'
import { RankScreen } from '@/screens/Rank/RankScreen'
import { ForGotPassword } from '@/screens/Login+SignUp/ForgotPassword'
import { SoloExamScreen } from '@/screens/SoloExam/SoloExamScreen'
import { AdminScreen } from '@/screens/Admin/AdminScreen'
import { AdminCreateScreen } from '@/screens/Admin/component/AdminCreateScreen'
import { images } from '@/vars'
import { NotificationScreen } from '@/screens/Admin/Notification/NotificationScreen'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { TabBarAdmin } from '@/screens/App/TabBar'
import {LoginScreen} from "@/screens/Login+SignUp/Login/LoginScreen";
const Tab = createMaterialBottomTabNavigator()

const sagaMiddleware = createSagaMiddleware()
const Stack = createStackNavigator()
let store = createStore(allReducers, applyMiddleware(sagaMiddleware))

const TabBarIcon = (focused: boolean, image: any): ReactElement => {
  return (
    <Image
      style={{
        width: focused ? 27 : 18,
        height: focused ? 27 : 18
      }}
      source={image}
    />
  )
}

export class AppScreen extends Component {
  Admin = () => {
    return (
      <Tab.Navigator
        barStyle={{ backgroundColor: 'white' }}
        screenOptions={{
          tabBarIcon: ({ focused }): ReactElement =>
            TabBarIcon(focused, images.icon_message_highlight)
        }}>
        <Tab.Screen
          name="QuestionScreen"
          component={AdminScreen}
          options={{
            tabBarLabel: 'Question',
            tabBarIcon: ({ focused }): ReactElement =>
              TabBarIcon(focused, images.icon_message_highlight)
          }}
        />
        <Tab.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{
            tabBarLabel: 'Notification',
            tabBarIcon: ({ focused }): ReactElement =>
              TabBarIcon(focused, images.icon_noti_fill)
          }}
        />
      </Tab.Navigator>
    )
  }

  render() {
    console.log('**** APPPPPP')
    return (
      <Provider store={store}>
        <StatusBar backgroundColor="blue" barStyle="light-content" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: false,
              headerShown: false
            }}
            initialRouteName="LoadingScreen">
            <Stack.Screen name="AdminScreen" component={TabBarAdmin} />
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ExamScreen" component={ExamScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ForGotPassword" component={ForGotPassword} />
            <Stack.Screen name="RankScreen" component={RankScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="SoloExamScreen" component={SoloExamScreen} />
            <Stack.Screen
              name="AdminCreateScreen"
              component={AdminCreateScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

sagaMiddleware.run(rootSaga)
