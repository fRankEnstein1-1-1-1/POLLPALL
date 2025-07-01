import { Image, View, Text, StyleSheet, ScrollView } from "react-native";
import Aboutcontainerinfo from "./Aboutcontainerinfo";
function AboutContainer() {
  return <>
   <ScrollView>
    <View style={styles.mainContainer}>
         
      <View style={styles.contentContainer}>
        <View style = {styles.textContainer}>
        <Image source={require("../assets/chad.jpg")} style={styles.imgprofile} />
        <Text style={styles.text}>GigaChad</Text>
        </View>
        <View style={styles.sigmaContainer}>
        <View style={styles.innerContainer}>
          <Aboutcontainerinfo />
          
           </View>
        </View>
      </View>
    </View>
    </ScrollView>
    </>
  
}

export default AboutContainer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    width:'100%',
    backgroundColor:'#ebebeb',
    justifyContent: "center",
  },
  contentContainer: {
    alignItems:'flex-start',
    width:'100%',
    backgroundColor:"#ededed",
margin:22,
padding:10,
    flex:1,
  },
  imgprofile: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  textContainer:{
     height: 200,
    width: 200,
    borderRadius: 100,
    alignSelf:'center',
    zIndex: 1, 
  },
  text:{
    color:'black',
    padding:4,
    fontSize:28,
    marginTop:4,
    fontWeight:'bold',
    textAlign:'center',
    zIndex:1,
  },
  sigmaContainer: {
    flex:1,
    backgroundColor:'#fbfcf8',
    elevation:25,
    width:'100%',
    borderRadius: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: -100, 
  },
  innerContainer:{
    marginTop:135,
    marginBottom:55,
    padding:16,
    width:'100%',

  },
 
});
