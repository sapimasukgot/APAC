import React from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeNavigator from './x';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SwipeNavigator />
    </GestureHandlerRootView>
  );
}
