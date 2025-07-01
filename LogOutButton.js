
import {Pressable,View,Text,StyleSheet} from 'react-native';
import { Alert } from 'react-native';

function LogOutButton({navigation})
{
    function Bye()
    {
        navigation.navigate("Start");
        Alert.alert("Sucess","SucessFully Logged Out !")
    }
    function Action()
    {
        Alert.alert("Logout" ,"You are about to logout!",[{text:'LogOut',onPress:()=>Bye() ,style:'destructive'},{text:'StayIn',style:'cancel'}])
    }
    return  <View >
            <Pressable style = {styles.ButtonContainer} onPress={Action}>
                <Text style = {styles.textContainer} > 
                   LogOut
                </Text>
            </Pressable>
        </View>
}
export default LogOutButton;
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fffefc',
        alignItems:'center',
        elevation:35,
        margin:12,
        padding:15,
        borderRadius:25,
    },
    ButtonContainer:{
        backgroundColor:'red',
        elevation:33,
        width:'55%',
        alignSelf:'center',
        padding:16,
        margin:24,
        borderRadius:35,
    },
    textContainer:{
        letterSpacing:-0.5,
        color:'white',
        fontWeight:'bold',
        fontSize:18,
        textAlign:'center',
    }
})
