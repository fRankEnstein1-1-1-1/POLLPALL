import { View,Text,StyleSheet,StatusBar } from "react-native";
function Header(props)
{
    return  <View style = {styles.header} >
        <Text style = {styles.headerTitle}>{props.title}</Text>
        <Text style = {styles.headerSubtitle}>{props.subtitle}</Text> 
    </View>
    
}
export default Header;
const styles = StyleSheet.create({
  
    header: {
        width: '100%',
        height: 150,
        backgroundColor: '#1d1f3c',
        justifyContent: 'flex-end',
        borderBottomRightRadius:28,
        borderBottomLeftRadius:28,
        padding:16,
        elevation: 4,
       
      },
      headerTitle: {
        color: 'white',
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: 0.5,
      },
      headerSubtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
        marginTop: 5,
      },
    
})