import{View,StyleSheet} from 'react-native';
import LoginScreen from './Screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Navigators/AppNavigator';
export default function App() {
  return (
   <View style = {styles.Maincontainer}>
 <NavigationContainer>
<AppNavigator/>
 </NavigationContainer>
   </View>
  );
}

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    backgroundColor: 'white'
    
  }
});
