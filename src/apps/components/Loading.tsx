import { Brand } from "@/src/assets/svgs";
import { colors } from "@/src/constants";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

interface Props {
  size?: number;
}

const Loading = ({ size }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Brand size={25}></Brand>
        <Text
          style={[{ fontSize: 32, color: colors.brand, fontWeight: "bold" }]}
        >
          Loading...
        </Text>
      </Animated.View>
    </View>
  );
};

export default Loading;