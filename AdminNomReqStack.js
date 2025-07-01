
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PendingRequestsScreen from "../Admin/PendingRequestsScreen";
import AdminNativetoptabs from "./AdminNativetoptabs";
import ANomDetails from "../Admin/ANomDetails";

function AdminNomReqStack()
{
    const Tab = createNativeStackNavigator()
    return<Tab.Navigator>
        <Tab.Screen name="Requests" component={PendingRequestsScreen} options={{headerShown:false}}/>
        <Tab.Screen name="ReqTabs" component={ANomDetails}  options={{headerShown:false}}/>
    </Tab.Navigator>
}

export default AdminNomReqStack;