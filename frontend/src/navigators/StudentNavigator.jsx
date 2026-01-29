import { createDrawerNavigator } from "@react-navigation/drawer"
import dashboard from '../components/dashboard'
import tests from '../components/tests'
import settings from '../components/settings'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useWindowDimensions } from "react-native"
import DrawerStyles from "../../styles/DrawerStyles";

const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator()

export default function StudentNavigator() {

  

  const { width } = useWindowDimensions();

  if (width > 768) {
    return (
      <Drawer.Navigator screenOptions={DrawerStyles}>
        <Drawer.Screen name="Dashboard" component={dashboard} />
        <Drawer.Screen name="Tests" component={tests} />
        <Drawer.Screen name='Settings' component={settings} />
      </Drawer.Navigator>
    );
  }

  return (
    <Tabs.Navigator>
      <Tabs.Screen name="dashboard" component={dashboard} />
      <Tabs.Screen name="tests" component={tests} />
      <Tabs.Screen name='settings' component={settings} />
    </Tabs.Navigator>
  );
}