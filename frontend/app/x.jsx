import * as React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import Analysis from './Analysis';
import Operation from './Operation';

const OperationRoute = () => <Operation />;
const AnalysisRoute = () => <Analysis />;

export default function SwipeNavigator() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'operation' },
    { key: 'analysis' },
  ]);

  const renderScene = SceneMap({
    operation: OperationRoute,
    analysis: AnalysisRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={() => null}  
    />
  );
}

const styles = StyleSheet.create({
});
