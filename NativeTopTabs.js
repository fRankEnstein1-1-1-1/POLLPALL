
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import NomineeAchivementsScreen from '../Screens/NomineeAchievementsScreen';
import NomineeBackGroundScreen from '../Screens/NomineeBackgroundScreen';
import NomineePromiseScreen from '../Screens/NomineePromiseScreen';

function NativeTopTabs({nominee})
{
    
    const Tab = createMaterialTopTabNavigator();
    return<Tab.Navigator>
        <Tab.Screen name='Promises' component={NomineePromiseScreen} initialParams={{nominee}} />
        <Tab.Screen name='Background' component={NomineeBackGroundScreen} initialParams={{nominee}} />
        <Tab.Screen name='Acheivements' component={NomineeAchivementsScreen}  initialParams={{nominee}}/>
    </Tab.Navigator>
    
}

export default NativeTopTabs;