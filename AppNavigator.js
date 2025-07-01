import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import BottomTab from './BottomTab';
import SignUpScreen from '../Screens/SignupScreen';
import startScreen from '../Screens/StartScreen';
import AdminTabs from './AdminTabs';

const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Start" component={startScreen} />
            <Stack.Screen name="Signup" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainApp" component={BottomTab} />
            <Stack.Screen name="AdminApp" component={AdminTabs} />
        </Stack.Navigator>
    );
}

export default AppNavigator;
