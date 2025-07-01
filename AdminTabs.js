import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import HomeAdminScreen from '../Admin/HomeAdminScreen';
import OngoingElectionsScreen from '../Admin/OngoingElectionScreen';
import AdminNomReqStack from './AdminNomReqStack';
import ScheduleScreen from '../Admin/ScheduleScreen';
import { SafeAreaView } from 'react-native';


 function AdminTabs() {
    const Tabs = createBottomTabNavigator();
  return (
    <SafeAreaView style={{flex:1}}>
    <Tabs.Navigator
     screenOptions={{
      tabBarStyle:{
        backgroundColor:'white',
        padding:5,
        height:'7%'

    },
    tabBarLabelStyle:{
        fontWeight:'condensed',
        color:'green'
     }}}
    >
      <Tabs.Screen
        name="HomeAdmin"
        component={HomeAdminScreen}
        options={{
            headerShown:false,
          title: 'Elections',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' size={size} color={color} />
          ),
        }}
      />
     {/*  <Tabs.Screen
        name="ongoing"
        component={OngoingElectionsScreen}
        options={{
         headerShown:false,
          title: 'Ongoing',
          tabBarIcon: ({ color, size }) => (
          <Ionicons name='construct-outline' size={size} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="pending-requests"
        component={AdminNomReqStack}
        options={{
            headerShown:false,
          title: 'Pending',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='clipboard-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        component={ScheduleScreen}
        options={{
            headerShown:false,
          title: 'Schedule',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='time-outline' size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
    </SafeAreaView>
  );
}
export default AdminTabs;
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
});