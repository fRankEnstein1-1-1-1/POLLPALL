
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import ProfilePageScreen from '../Screens/ProfilePageScreen'
import {Ionicons} from '@expo/vector-icons';
import NativeStackTab from './NativeStackTab';
import NomInputNav from './NomInputNav';

function BottomTab()
{
const Tabs = createBottomTabNavigator();

    return <>
        <Tabs.Navigator screenOptions={{
            tabBarStyle:{
                backgroundColor:'white',
                padding:5,
                height:'7%'

            },
            tabBarLabelStyle:{
                fontWeight:'condensed',
                color:'green'
            }
        }} >
            <Tabs.Screen  name = "Home" component={HomeScreen} options ={{headerShown:false, tabBarIcon :({size,color}) => {return <Ionicons name='home-outline' size = {size} color={color} />}  }}/>
            <Tabs.Screen  name = "Vote" component={NativeStackTab} options ={{headerShown:false, tabBarIcon :({size,color}) => {return <Ionicons name='hand-right-outline' size = {size} color={color} />}  }}/>
            <Tabs.Screen  name = "Nominee" component={NomInputNav} options ={{headerShown:false, tabBarIcon :({size,color}) => {return <Ionicons name='person-outline' size = {size} color={color} />}  }}/>
            <Tabs.Screen  name = "Profile" component={ProfilePageScreen} options ={{headerShown:false, tabBarIcon :({size,color}) => {return <Ionicons name='person-circle-outline' size = {size} color={color} />}  }}/>
           
        </Tabs.Navigator>
        </>
}
export default BottomTab;
