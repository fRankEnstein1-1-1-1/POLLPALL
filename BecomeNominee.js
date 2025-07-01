import {Pressable,View,Text,StyleSheet} from 'react-native';
import { Alert } from 'react-native';
function BecomeNominee()
{


    function Agreed()
    {
        Alert.alert('Returned',"You will be directed to a new screen!",[{text:'ok',style:'cancel'},
            {text:'Cancel',onPress:()=>NotAgreed(),style:'destructive'} 
        ])
    }


    function NotAgreed()
    {
        Alert.alert('Returned',"You didnt change you account type!",[{text:'ok',style:'cancel'}])
    }

    function Action()
    {
        Alert.alert("Cuation","You Are About To Change Your Acoount Type",[{text:"OK",onPress:() =>  Agreed(), style:'destructive'},
            {text:'Cancel',onPress:()=>NotAgreed(),style:'destructive'} 

        ] )
    }
    return  <View >
        <Pressable style = {styles.ButtonContainer} onPress={Action}>
            <Text style = {styles.textContainer} > 
                Nominee Login
            </Text>
        </Pressable>
    </View>
}
export default BecomeNominee;
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
        backgroundColor:'#da9100',
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