import Header from "../Components/Header"
import AdminNativetoptabs from "../Navigators/AdminNativetoptabs"
import { useEffect } from "react"
import { useNavigation } from "@react-navigation/native"

export default function ANomDetails({route}) 
{


const {data}= route.params
 const Navigation = useNavigation();
    useEffect( ()=>
    {
      Navigation.getParent()?.setOptions({tabBarStyle:{display:'none'}});
   
    return()=>{
      Navigation.getParent()?.setOptions({tabBarStyle:{display:'flex'}});
 }
    },[Navigation]
)

return<>
<Header title = {data.name}/>
<AdminNativetoptabs/>
</>
   
  
}