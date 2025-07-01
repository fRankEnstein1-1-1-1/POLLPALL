import {View,Text,StyleSheet} from 'react-native';
import { StatusBar } from "expo-status-bar";
import PrimaryButton from '../Buttons/PrimaryButton';
function StartScreen({navigation}){
    function onPressSignUp(){
      navigation.navigate("Signup");  
    }
    function onPressLogin(){
      navigation.navigate("Login");
        }
return(
     <View style={styles.Screen}>
      <View style={styles.TopContainer}>
        <StatusBar style="auto" />
        <Text style={[styles.textcontainer,{marginTop:25,fontSize:50,color:'rgb(56, 64, 179)',fontFamily:'Poppins'}]}>Pollpal</Text>
        <View style={styles.textContainer}>
        <Text style={styles.textcontainer}>Honor the past</Text>
        <Text style={[styles.textcontainer,{color:'#6A5ACD',fontSize:30,marginVertical:2,}]}>protect</Text>
        <Text style={styles.textcontainer}> the future</Text>
           </View>
      </View>
      <View style={styles.BottomContainer}>
        <PrimaryButton style={styles.ButtonContainer} onPress={onPressSignUp}>Sign up</PrimaryButton>
        <PrimaryButton
          style={[
            styles.ButtonContainer,
            {
              backgroundColor:'#1D1F3C',
              borderColor:'#6A5ACD',
              borderWidth:3,
              
            },
          ]}
          onPress={onPressLogin}
        >
          Log in
        </PrimaryButton>
      </View>
    </View>
);
}
const styles = StyleSheet.create({
  textContainer:{
   alignItems:'center',
  },
  textcontainer:{
  
   fontSize:24,
  },
  Screen:{
   flex : 1,
  },
  TopContainer: {
    flex: 4,
    backgroundColor: "white",
    justifyContent :'center',
    alignItems:'center',
  },
  ButtonContainer: {
    backgroundColor: "#6A5ACD",
    color: '#FBF5DD',
    padding: 16,
    width: 220,
    textAlign: "center",
    borderRadius: 50,
    elevation:23,
  },
  BottomContainer: {
    flex: 3,
    borderTopLeftRadius : 50,
    borderTopRightRadius : 50, 
    justifyContent :'space-evenly',
    alignItems :'center',
    backgroundColor: '#1D1F3C',
  },
});

export default StartScreen;