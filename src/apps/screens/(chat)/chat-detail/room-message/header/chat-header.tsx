import { clearSelectedRoom } from "@/libs/redux";
import { useAppSelector } from "@/libs/redux/redux.config";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import styles from "../styles";

interface Props {
	showSearchBar: boolean;
	setShowSearchBar: (show: boolean) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	myUserId: string | null;
}

const Header = ({ showSearchBar, setShowSearchBar, setSearchQuery, myUserId, searchQuery }: Props) => {
	const navigation = useNavigation();

	const { selectedRoom } = useAppSelector((state) => state.selectedRoom);
	const dispatch = useDispatch();

	const handleBack = () => {
		dispatch(clearSelectedRoom());
		navigation.goBack();
	};

	const handlePressRoomInformation = () => {
		navigation.navigate("RoomInformationScreen");
	};

	const renderNameChat = () => {
		if (selectedRoom?.type === "group") {
			return selectedRoom?.name;
		} else {
			return selectedRoom?.detailRoom?.find((user) => user.id !== myUserId)?.fullName || "Unknown User";
		}
	};

	const toggleSearchBar = () => {
		setShowSearchBar(!showSearchBar);
		setSearchQuery("");
	};
	return (
		<>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBack}>
					<Ionicons
						name="arrow-back"
						size={24}
						color="white"
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handlePressRoomInformation}
					style={{
						flex: 1,
						justifyContent: "flex-start",
						alignItems: "flex-start",
					}}
				>
					<Text
						style={[styles.headerText]}
						numberOfLines={1}
					>
						{renderNameChat()}
					</Text>
				</TouchableOpacity>
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
						onPress={() => toggleSearchBar()}
					>
						<Ionicons
							name="search-outline"
							size={22}
							color="white"
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.headerIcon}
						onPress={handlePressRoomInformation}
					>
						<Feather
							name="info"
							size={22}
							color="white"
						/>
					</TouchableOpacity>
				</View>
			</View>
			{showSearchBar && (
				<View style={[styles.searchContainer]}>
					<TextInput
						style={[styles.searchInput]}
						placeholder="Tìm kiếm tin nhắn..."
						value={searchQuery}
						onChangeText={setSearchQuery}
						autoFocus
					/>
					<TouchableOpacity
						onPress={() => toggleSearchBar()}
						style={styles.cancelSearchButton}
					>
						<Text style={styles.cancelSearchText}>Hủy</Text>
					</TouchableOpacity>
				</View>
			)}
		</>
	);
};

export default Header;
