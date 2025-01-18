import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface VerificationModalProps {
	visible: boolean;
	phoneNumber: string;
	onContinue: () => void;
	onChangeNumber: () => void;
	onClose: () => void;
}

export const VerificationModal = ({
	visible,
	phoneNumber,
	onContinue,
	onChangeNumber,
	onClose,
}: VerificationModalProps) => {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View className="flex-1 bg-black/50 justify-center items-center px-12">
				<View className="w-full bg-white rounded-xl px-5 pt-5">
					<Text className="text-lg font-semibold  mb-2">
						{`Nhận mã xác thực qua số\n${phoneNumber}?`}
					</Text>

					<Text className="text-gray-600  mb-6">
						Zalo sẽ gửi mã xác thực cho bạn qua số điện thoại này
					</Text>
					<View className="border-t-2 border-[#f6f6f6]"></View>

					<TouchableOpacity
						onPress={onContinue}
						className="w-full py-3 rounded-lg mb-1"
					>
						<Text className="text-blue-500 text-center font-semibold ">Tiếp tục</Text>
					</TouchableOpacity>
					<View className="border-t-2 border-[#f6f6f6]"></View>
					<TouchableOpacity
						onPress={onChangeNumber}
						className="w-full py-3 mb-3"
					>
						<Text className=" text-center font-semibold ">Đổi số khác</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};
