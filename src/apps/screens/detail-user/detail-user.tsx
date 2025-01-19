import { ArrowBack } from "@/assets/svgs";
import { More } from "@/assets/svgs/more";
import React from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";

export const UserDetailScreen = () => {
	return (
		<SafeAreaView className="flex-1 bg-white">
      
      <View className="absolute w-full z-10 flex-row items-center justify-between p-4 pt-14 bg-black/5">
        <TouchableOpacity 
          className="w-10 h-8 items-center justify-center"
        >
          <ArrowBack size={25} color="white" outline="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-10 h-1 items-center justify-center"
        >
          <More size={45} color="white" outline="white" />
        </TouchableOpacity>
      </View>

			<ScrollView>
        
				<View className="relative h-60">
					<Image
						source={{
							uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nwzH4PUdknfEzKnran645sc1mDjM2d.png",
						}}
						className="w-full h-full"
					/>
				</View>

				{/* Profile Section */}
				<View className="items-center -mt-16">
          <View className="border-4 border-white rounded-full">
            <Image
              source={{
                uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nwzH4PUdknfEzKnran645sc1mDjM2d.png",
              }}
              className="w-32 h-32 rounded-full "
            />
          </View>
					
					<Text className="text-2xl font-semibold mt-4">Nguyễn Tú</Text>
					<TouchableOpacity className="flex-row items-center mt-2">
						<Text className="text-[#007AFF] ml-2">Cập nhật giới thiệu bản thân</Text>
					</TouchableOpacity>
				</View>

				{/* Action Buttons */}
				<View className="flex-row justify-around mt-6 px-4">
					<TouchableOpacity className="items-center bg-white p-4 rounded-xl shadow-sm flex-1 mx-2">
						<View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center"></View>
						<Text className="mt-2 text-sm">Cài ZStyle</Text>
					</TouchableOpacity>

					<TouchableOpacity className="items-center bg-white p-4 rounded-xl shadow-sm flex-1 mx-2">
						<View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center"></View>
						<Text className="mt-2 text-sm">Ảnh của tôi</Text>
					</TouchableOpacity>

					<TouchableOpacity className="items-center bg-white p-4 rounded-xl shadow-sm flex-1 mx-2">
						<View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center"></View>
						<Text className="mt-2 text-sm">Kho khoảnh khắc</Text>
					</TouchableOpacity>
				</View>

				{/* What's New Section */}
				<View className="mt-8 px-6">
					<Text className="text-xl font-semibold text-center">Hôm nay Nguyễn Tú có gì vui?</Text>
					<Text className="text-gray-500 text-center mt-2">
						Đây là Nhật ký của bạn - Hãy làm đầy Nhật ký với những dấu ấn cuộc đời và kỷ niệm đáng nhớ
						nhé!
					</Text>
					<TouchableOpacity className="bg-[#007AFF] rounded-full py-4 mt-6">
						<Text className="text-white text-center font-semibold">Đăng lên Nhật ký</Text>
					</TouchableOpacity>
				</View>

			</ScrollView>
		</SafeAreaView>
	);
};
