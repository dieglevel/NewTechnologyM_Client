import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { fonts } from './src/assets/fonts';
import { Loading } from './src/apps/components';

export default function App() {
	const [fontsLoaded] = useFonts(fonts);

	if (!fontsLoaded) {
		return <Loading size={300} />;
	} 

  return (
    <View>
      <Text style={{fontFamily: ""}}></Text>
    </View>
  );
}