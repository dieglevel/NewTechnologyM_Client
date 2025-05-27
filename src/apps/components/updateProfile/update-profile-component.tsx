import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Text, TextInput, Pressable, StyleSheet, Touchable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CoverPhoto } from "./cover-photo/cover-photo";
import { MainPhoto } from "./main-photo/main-photo";
import { getAccountApi } from "@/services/auth";
import { ErrorResponse } from "@/libs/axios/axios.config";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { handleProfileUpdate } from "./handle";
import { StackScreenNavigationProp } from "@/libs/navigation";
import DatePicker from "react-native-date-picker";
import { socketService } from "@/libs/socket/socket";

interface UpdateProfileComponentProps {}

export const UpdateProfileComponent = () => {
	const focus = useIsFocused();

	const navigator = useNavigation<StackScreenNavigationProp>();

	const [fullName, setFullName] = useState<string>("");
	const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
	const [gender, setGender] = useState<boolean>(false);

	const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	const [open, setOpen] = useState(false);

	useEffect(() => {
		socketService.connect();
	}, [])

	useEffect(() => {
		const getData = async () => {
			try {
				const response = await getAccountApi();
				if (response.statusCode === 200) {
					const data = response.data?.detailInformation;
					setFullName(data?.fullName || "");
					setDateOfBirth(data?.dateOfBirth ? new Date(data.dateOfBirth) : null);
					setGender(data?.gender === true ? true : false);

					setThumbnailUrl(data?.thumbnailUrl || null);
					setAvatarUrl(data?.avatarUrl || null);
				}
			} catch (error) {
				const err = error as ErrorResponse;
			}
		};

		if (focus) {
			getData();
		}
	}, [focus]);

	return (
		<View style={styles.container}>
			<CoverPhoto uri={thumbnailUrl} />
			<MainPhoto uri={avatarUrl} />

			<View style={styles.avatarContainer}>
				<TouchableOpacity style={styles.avatarWrapper}>
					{/* <Image source={{ uri: user.mainAvatar }} style={styles.avatar} /> */}
					<View style={styles.cameraIcon}>
						<Ionicons
							name="camera"
							size={18}
							color="#000"
						/>
					</View>
				</TouchableOpacity>
			</View>

			<View style={styles.form}>
				<View style={styles.inputGroup}>
					<TextInput
						value={fullName || ""}
						onChangeText={setFullName}
						style={styles.input}
						placeholder="Nhập họ tên"
					/>
					<Ionicons
						name="pencil-outline"
						size={20}
						color="gray"
					/>
				</View>

				<TouchableOpacity
					style={styles.inputGroup}
					onPress={() => setOpen(true)}
				>
					<Text>{dateOfBirth ? dateOfBirth.toLocaleDateString() : "Chọn ngày sinh"}</Text>
					<Ionicons
						name="calendar-outline"
						size={20}
						color="gray"
					/>

					<DatePicker
						// greate 13 years old
						maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 13))}
						modal
						mode="date"
						open={open}
						date={dateOfBirth || new Date()}
						onConfirm={(date) => {
							setOpen(false);
							setDateOfBirth(date);
						}}
						onCancel={() => {
							setOpen(false);
						}}
					/>
				</TouchableOpacity>

				<View style={styles.genderContainer}>
					<Pressable
						style={styles.genderOption}
						onPress={() => setGender(true)}
					>
						<View
							style={[
								styles.genderCircle,
								gender === true ? styles.genderSelected : styles.genderUnselected,
							]}
						/>
						<Text style={styles.genderLabel}>Nam</Text>
					</Pressable>

					<Pressable
						style={styles.genderOption}
						onPress={() => setGender(false)}
					>
						<View
							style={[
								styles.genderCircle,
								gender === false ? styles.genderSelected : styles.genderUnselected,
							]}
						/>
						<Text style={styles.genderLabel}>Nữ</Text>
					</Pressable>
				</View>

				<TouchableOpacity
					style={styles.saveButton}
					onPress={() => {
						handleProfileUpdate(fullName, dateOfBirth?.toISOString() || "", gender, navigator);
					}}
				>
					<Text style={styles.saveButtonText}>LƯU</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",

	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#3B82F6",
	},
	headerText: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
		marginLeft: 12,
	},
	avatarContainer: {
		alignItems: "center",
		marginTop: -32,
	},
	avatarWrapper: {
		borderWidth: 4,
		borderColor: "white",
		borderRadius: 999,
		overflow: "hidden",
		position: "relative",
	},
	avatar: {
		width: 128,
		height: 128,
		borderRadius: 999,
	},
	cameraIcon: {
		position: "absolute",
		bottom: 0,
		right: 0,
		backgroundColor: "white",
		padding: 4,
		borderRadius: 999,
	},
	form: {
		paddingHorizontal: 24,
		marginTop: 24,
		gap: 16,
	},
	inputGroup: {
		borderBottomWidth: 1,
		borderBottomColor: "#D1D5DB",
		paddingBottom: 8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	input: {
		fontSize: 16,
		flex: 1,
	},
	genderContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8,
		gap: 24,
	},
	genderOption: {
		flexDirection: "row",
		alignItems: "center",
	},
	genderCircle: {
		width: 20,
		height: 20,
		borderRadius: 999,
		borderWidth: 1,
	},
	genderSelected: {
		backgroundColor: "#3B82F6",
		borderColor: "#3B82F6",
	},
	genderUnselected: {
		borderColor: "#9CA3AF",
	},
	genderLabel: {
		marginLeft: 8,
		fontSize: 16,
	},
	saveButton: {
		backgroundColor: "#3B82F6",
		marginTop: 24,
		paddingVertical: 12,
		borderRadius: 999,
		alignItems: "center",
	},
	saveButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});
