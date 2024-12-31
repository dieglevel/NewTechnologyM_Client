import { Tab } from "@/src/libs/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { HomeScreen, UserScreen } from "@/src/apps/screens";

const BottomTabScreenApp = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="UserScreen" component={UserScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabScreenApp;