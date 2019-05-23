
import React from 'react';

import {createStackNavigator,createAppContainer} from 'react-navigation';
import HomeScreen from './views/HomeScreen';
import AddUser from './views/AddUser';
import EditCustomer from './views/EditCustomer';
 
const App = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen
  },
  AddUser: {
    screen: AddUser,
    navigationOptions: {
      title: 'Add Customer',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  EditCustomer: {
    screen: EditCustomer,
    navigationOptions: {
      title: 'Edit Customer',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
});

//For React Navigation Version 3+
export default createAppContainer(App);