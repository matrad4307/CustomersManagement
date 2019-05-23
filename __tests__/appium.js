// __tests__/Intro-test.js
import React from 'react';
import HomeScreen from '../views/HomeScreen';
import { openDatabase } from 'react-native-sqlite-storage';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<HomeScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});