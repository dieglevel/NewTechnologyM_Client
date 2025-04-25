import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../styles";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAppSelector } from "@/libs/redux/redux.config";
import { toggleSearchBar } from "../message-utils";
import { useDispatch } from "react-redux";
import { clearSelectedRoom } from "@/libs/redux";
import { ExpoSecureStoreKeys, getSecure } from "@/libs/expo-secure-store/expo-secure-store";
import { useEffect } from "react";

interface Props {
	showSearchBar: boolean;
	setShowSearchBar: (show: boolean) => void;
	setSearchQuery: (query: string) => void;
	myUserId: string | null;
}

const Header= ({ showSearchBar, setShowSearchBar, setSearchQuery, myUserId }: Props) => {
   const navigation = useNavigation();

	const {selectedRoom} = useAppSelector((state) => state.selectedRoom)
	const dispatch = useDispatch();

		

	const handleBack = () => {
		dispatch(clearSelectedRoom())
		navigation.goBack();
	}

	const renderNameChat = () => {

		if (selectedRoom?.type === "group") {
			return selectedRoom?.name;
		} else {
			return selectedRoom?.detailRoom.find((user) => user.id !== myUserId)?.fullName || "Unknown User";
		}
	}

	return (
		<View style={styles.header}>
			<TouchableOpacity onPress={handleBack}>
				<Ionicons
					name="arrow-back"
					size={24}
					color="white"
				/>
			</TouchableOpacity>
			<Text style={styles.headerText} numberOfLines={1}>{renderNameChat()}</Text>
			<View style={styles.headerIcons}>
				<TouchableOpacity style={styles.headerIcon}>
					<Ionicons
						name="call-outline"
						size={22}
						color="white"
					/>
				</TouchableOpacity>
				<TouchableOpacity style={styles.headerIcon}>
					<Ionicons
						name="videocam-outline"
						size={22}
						color="white"
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.headerIcon}
					onPress={() => toggleSearchBar(showSearchBar, setShowSearchBar, setSearchQuery)}
				>
					<Ionicons
						name="search-outline"
						size={22}
						color="white"
					/>
				</TouchableOpacity>
				<TouchableOpacity style={styles.headerIcon}>
					<Feather
						name="info"
						size={22}
						color="white"
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Header;
