import { createDrawerNavigator } from "@react-navigation/drawer"
import dashboard from '../components/dashboard'
import tests from '../components/tests'
import settings from '../components/settings'
import students from '../components/students'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useWindowDimensions } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../components/HomeScreen"
import ProfileScreen from "../components/ProfileScreen"
import UserScreen from "../components/UserScreen"
import ClassroomProfile from "../components/ClassroomProfile"
import Colors from "../../styles/Colors"

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const StackNavigator = () => {

  return (
    <Stack.Navigator
      screenOptions= {  ({navigation}) => ({
        statusBarColor : '#0163d2',
        headerStyle: {
          backgroundColor: Colors.secondaryColor,
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        // headerLeft : () => {
        //   return <Ionicons
        //     name="menu"
        //     size={24}
        //     color = "#fff"
        //     style={{ marginLeft: 15 }}
            // onPress={() => navigation.toggleDrawer()}
        //   />
        // }
      })}

    >
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Profile" component={ProfileScreen}/>
      <Stack.Screen name="User" component={UserScreen}
       options={{headerShown:true}}/>
    </Stack.Navigator>
  );
}

const DrawerNavigator = () => { 

  return (

    <Drawer.Navigator screenOptions={{headerShown:false}}
      drawerContent={(props) => <ClassroomProfile {...props}
      
    />}
    >
            <Drawer.Screen name="Home" component={StackNavigator}/>
    </Drawer.Navigator>

  );
}

export default function TutorNavigator() {

  const { width } = useWindowDimensions();

  if (width > 768) {
    return (
        <DrawerNavigator/>
    );
  }
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="dashboard" component={dashboard} />
      <Tabs.Screen name="tests" component={tests} />
      <Tabs.Screen name='students' component={students} />
      <Tabs.Screen name='settings' component={settings} />
    </Tabs.Navigator>
  );
}


{/* <Drawer.Navigator screenOptions={DrawerStyles}
drawerContent={(props) => <ClassroomProfile {...props} />}
>
<Drawer.Screen name="Dashboard" component={dashboard} />
<Drawer.Screen name="Tests" component={tests} />
<Drawer.Screen name='Students' component={students} />
<Drawer.Screen name='Settings' component={settings} />
</Drawer.Navigator> */}