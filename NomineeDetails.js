import { View, Text } from 'react-native';
import Header from '../Components/Header';
import NativeTopTabs from '../Navigators/NativeTopTabs';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import VoteButton from '../Buttons/VoteButton';

export default function NomineeDetails({route}) {
    const {nominee} = route.params
   

    const Navigation = useNavigation();
    useEffect( ()=>
    {
      Navigation.getParent()?.setOptions({tabBarStyle:{display:'none'}});
   
    return()=>{
      Navigation.getParent()?.setOptions({tabBarStyle:{display:'flex'}});
 }
    },[Navigation]
)


  return  <>  
  <Header title = {nominee.fullName} subtitle="Vote for your nominee"/>
   <NativeTopTabs nominee = {nominee}/>
   <VoteButton nomineeId={nominee.id} nomineePosition={nominee.position} />


   </>
  
  
}