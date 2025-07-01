import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import NomineeAchievements from "../Admin/NomineeAchievements";
import NomineeBack from "../Admin/NomineeBack";
import NomineePromises from "../Admin/NomineePromises";

function AdminNativetoptabs()
{
    const Tab = createMaterialTopTabNavigator();
    return <Tab.Navigator>
<Tab.Screen name ='Promises' component={NomineePromises} />
<Tab.Screen name ='Achievements' component={NomineeAchievements} />
<Tab.Screen name ='Background' component={NomineeBack}  />
    </Tab.Navigator>
}
export default AdminNativetoptabs;