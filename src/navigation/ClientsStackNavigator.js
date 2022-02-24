import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  ClientListScreen,
  ObjectsScreen,
  ObjectScreen,
  ClientDetailScreen,

  DocumentsScreen,
  DocumentFileScreen,
  PDFScreen,
  VideoStreamScreen,
  VideoStreamFullScreen,
  CraneOperatorScheduleScreen,
  CraneOperatorScheduleEditScreen,
  DebtListScreen
} from '../screens';

const Stack = createStackNavigator();

const screenOptions = {
  headerBackTitle: 'Назад',
  headerTintColor: '#000000',
  headerStyle: {
    backgroundColor: '#FED000',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
};

const ClientsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ClientList" component={ClientListScreen} />
      <Stack.Screen name="ClientDetailScreen" component={ClientDetailScreen} />
      <Stack.Screen name="ObjectsScreen" component={ObjectsScreen} />
      <Stack.Screen name="ObjectScreen" component={ObjectScreen} />

      <Stack.Screen name="DebtListScreen" component={DebtListScreen} />

      <Stack.Screen name="DocumentsScreen" component={DocumentsScreen} />
      <Stack.Screen name="DocumentFileScreen" component={DocumentFileScreen} />
      <Stack.Screen name="PDFScreen" component={PDFScreen} />
      <Stack.Screen name="VideoStreamScreen" component={VideoStreamScreen} />
      <Stack.Screen name="VideoStreamFullScreen" component={VideoStreamFullScreen} options={{ headerShown: false, tabBarVisible: false }} />
      <Stack.Screen name="CraneOperatorScheduleScreen" component={CraneOperatorScheduleScreen} />
      <Stack.Screen name="CraneOperatorScheduleEditScreen" component={CraneOperatorScheduleEditScreen} />
    </Stack.Navigator>
  );
}

export { ClientsStackNavigator };