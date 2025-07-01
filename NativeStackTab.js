
import{createNativeStackNavigator} from '@react-navigation/native-stack';
import NomineeSelectScreen from '../Screens/NomineeSelectScreen';
import NomineeDetails from '../Screens/NomineeDetails';
import PositionSelectScreen from '../Screens/PositionSelctScreen';
function NativeStackTab()
    {
        const Stack = createNativeStackNavigator();
        return (
            <Stack.Navigator>

                <Stack.Screen name = "PositionSelect" component = {PositionSelectScreen} options= {{title:"select position",headerShown:false} }/>
                <Stack.Screen name = "NomineeSelectScreen" component = {NomineeSelectScreen} options= {{title:"selext nominee",headerShown:false} }/>
                <Stack.Screen name = "NomineeDetails" component = {NomineeDetails} options= {{title:"selext nominee",headerShown:false, tabBarstyle:{display:'none'}}}/>
            </Stack.Navigator>
        )
    }

    export default NativeStackTab;