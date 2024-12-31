import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";

import { SafeAreaView, View } from "react-native";
import { Stack } from "@/src/libs/navigation";
import BottomTabScreenApp from "./BottomTabScreenApp";

export const RootScreenApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TabScreenApp"
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="TabScreenApp" component={BottomTabScreenApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootScreenApp;
