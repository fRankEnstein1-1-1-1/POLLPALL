import { View ,Text,StyleSheet} from "react-native";

function Aboutcontainerinfo()
{
    return <View  style = {styles.mainContainer} >
        <View style = {styles.innercontainer} >
        <Text style = {styles.text}>  Text:Value </Text>
        <Text style = {styles.text}>  Text:Value </Text>
        <Text style = {styles.text}>  Text:Value </Text>
        <Text style = {styles.text}>  Text:Value </Text>
        <Text style = {styles.text}>  Text:Value </Text>
        </View>
    </View>
}
export default Aboutcontainerinfo;
const styles = StyleSheet.create({
    mainContainer:{
      
       margin:32,
         
       borderRadius:8,
       height:500,
     
       margin:10,

    },
    text:{
        letterSpacing:-0.2,
        fontSize:20,
        margin:4,
        backgroundColor:'#fbfcf8',
        elevation:.4,
        borderRadius:5,
        padding:8,
        fontWeight:'semibold',
    },
    innercontainer:{
        margin:12,
         padding:6,  
    }
})