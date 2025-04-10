import { TextInputProps } from "react-native";

const TextInput = (props: TextInputProps) => {
	return <TextInput {...props} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10 }} />;
};

export default TextInput;
