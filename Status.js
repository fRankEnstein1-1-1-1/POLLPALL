import{View,Text,StyleSheet} from 'react-native';
function Status(props)
{
    return <View style={styles.container}>
        <Text style = {styles.text}>Current Status : {props.currstatus}</Text>
    </View>
}
export default Status;
const styles = StyleSheet.create(
    {
        container:{
            backgroundColor:'#03c04a',
            alignItems:'center',
            elevation:35,
            margin:12,
            padding:25,
            borderRadius:15,
        },
        text:{
            fontSize:24,
            fontWeight:'bold',

        }


    }

)