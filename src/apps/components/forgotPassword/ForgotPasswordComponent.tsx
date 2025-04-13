// import { useNavigation } from "@react-navigation/native";
// import React, { useRef, useState } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Modal,
//   StyleSheet,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// export const ForgotPasswordComponent = () => {
//   const navigation = useNavigation();
//   const [phone, setPhone] = useState("");
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [showOTPModal, setShowOTPModal] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);

//   const inputRefs = useRef<Array<TextInput | null>>([]);

//   const handleSubmit = () => {
//     if (phone.trim().length > 0) {
//       setShowConfirmModal(true);
//     }
//   };

//   const handleConfirmPhone = () => {
//     setShowConfirmModal(false);
//     setShowOTPModal(true);
//     console.log("Đã gửi mã OTP về: ", phone);
//   };

//   const handleChangeOtp = (text: string, index: number) => {
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);

//     if (text && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//     if (!text && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleContinueOTP = () => {
//     const otpValue = otp.join("");
//     if (otpValue.length === 6) {
//       console.log("OTP hợp lệ:", otpValue);
//       setShowOTPModal(false);
//     } else {
//       alert("Vui lòng nhập đầy đủ mã OTP.");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         style={styles.keyboardAvoidingView}
//       >
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//           <Text style={styles.headerText}>Lấy lại mật khẩu</Text>
//         </View>

//         <View style={styles.inputSection}>
//           <Text style={styles.description}>
//             Nhập số điện thoại để lấy lại mật khẩu
//           </Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Nhập số điện thoại"
//               keyboardType="phone-pad"
//               value={phone}
//               onChangeText={setPhone}
//             />
//             {phone.length > 0 && (
//               <TouchableOpacity
//                 onPress={() => setPhone("")}
//                 style={styles.clearButton}
//               >
//                 <Ionicons name="close-circle" size={20} color="gray" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         <View style={styles.submitButtonContainer}>
//           <TouchableOpacity
//             onPress={handleSubmit}
//             style={styles.submitButton}
//           >
//             <Ionicons name="arrow-forward" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>

//       <Modal transparent={true} visible={showConfirmModal} animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Xác nhận số điện thoại</Text>
//             <Text style={styles.modalDescription}>
//               (+84) {phone}
//               {"\n"}Số điện thoại này sẽ được sử dụng để nhận mã xác thực.
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 onPress={() => setShowConfirmModal(false)}
//                 style={styles.cancelButton}
//               >
//                 <Text style={styles.cancelButtonText}>Hủy</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handleConfirmPhone}
//                 style={styles.confirmButton}
//               >
//                 <Text style={styles.confirmButtonText}>Xác nhận</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Modal transparent={true} visible={showOTPModal} animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Nhập mã xác thực</Text>
//             <Text style={styles.modalDescription}>
//               Đã gửi mã OTP đến số (+84) {phone}
//             </Text>

//             <View style={styles.otpContainer}>
//               {otp.map((digit, index) => (
//                 <TextInput
//                   key={index}
//                   ref={(ref) => (inputRefs.current[index] = ref)}
//                   style={styles.otpInput}
//                   keyboardType="number-pad"
//                   maxLength={1}
//                   value={digit}
//                   onChangeText={(text) => handleChangeOtp(text, index)}
//                 />
//               ))}
//             </View>

//             <TouchableOpacity
//               style={styles.continueButton}
//               onPress={handleContinueOTP}
//             >
//               <Text style={styles.continueButtonText}>Tiếp tục</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "white", // bg-white
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row", // flex-row
//     alignItems: "center", // items-center
//     padding: 16, // p-4
//     backgroundColor: "#3b82f6", // bg-blue-500
//   },
//   headerText: {
//     color: "white", // text-white
//     fontSize: 18, // text-lg
//     fontWeight: "600", // font-semibold
//     marginLeft: 16, // ml-4
//   },
//   inputSection: {
//     padding: 16, // p-4
//   },
//   description: {
//     color: "#6b7280", // text-gray-500
//     marginBottom: 8, // mb-2
//   },
//   inputContainer: {
//     borderBottomWidth: 1, // border-b
//     borderBottomColor: "#06b6d4", // border-cyan-500
//     flexDirection: "row", // flex-row
//     alignItems: "center", // items-center
//   },
//   textInput: {
//     flex: 1, // flex-1
//     fontSize: 16, // text-base
//     paddingVertical: 8, // py-2
//     paddingRight: 32, // pr-8
//   },
//   clearButton: {
//     position: "absolute",
//     right: 0,
//     padding: 8, // p-2
//   },
//   submitButtonContainer: {
//     flex: 1,
//     justifyContent: "flex-end", // justify-end
//     alignItems: "flex-end", // items-end
//     padding: 16, // p-4
//   },
//   submitButton: {
//     width: 48, // w-12
//     height: 48, // h-12
//     backgroundColor: "#3b82f6", // bg-blue-500
//     borderRadius: 24, // rounded-full
//     alignItems: "center", // items-center
//     justifyContent: "center", // justify-center
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center", // justify-center
//     alignItems: "center", // items-center
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // bg-black/50
//     paddingHorizontal: 24, // px-6
//   },
//   modalContent: {
//     backgroundColor: "white", // bg-white
//     borderRadius: 16, // rounded-2xl
//     padding: 24, // p-6
//     width: "100%",
//     maxWidth: 400, // max-w-md
//   },
//   modalTitle: {
//     fontSize: 18, // text-lg
//     fontWeight: "600", // font-semibold
//     marginBottom: 8, // mb-2
//     textAlign: "center",
//   },
//   modalDescription: {
//     textAlign: "center",
//     color: "#6b7280", // text-gray-500
//     marginBottom: 16, // mb-4
//   },
//   modalButtons: {
//     flexDirection: "row", // flex-row
//     justifyContent: "space-between", // justify-between
//     marginTop: 8, // mt-2
//   },
//   cancelButton: {
//     flex: 1, // flex-1
//     paddingVertical: 8, // py-2
//     marginRight: 8, // mr-2
//     backgroundColor: "#e5e7eb", // bg-gray-200
//     borderRadius: 8, // rounded-lg
//     alignItems: "center", // items-center
//   },
//   cancelButtonText: {
//     color: "#6b7280", // text-gray-500
//     fontWeight: "500", // font-medium
//   },
//   confirmButton: {
//     flex: 1, // flex-1
//     paddingVertical: 8, // py-2
//     marginLeft: 8, // ml-2
//     backgroundColor: "#3b82f6", // bg-blue-500
//     borderRadius: 8, // rounded-lg
//     alignItems: "center", // items-center
//   },
//   confirmButtonText: {
//     color: "white", // text-white
//     fontWeight: "500", // font-medium
//   },
//   otpContainer: {
//     flexDirection: "row", // flex-row
//     justifyContent: "space-between", // justify-between
//     marginBottom: 16, // mb-4
//   },
//   otpInput: {
//     width: 40, // w-10
//     height: 48, // h-12
//     borderWidth: 1, // border
//     borderColor: "#d1d5db", // border-gray-300
//     borderRadius: 8, // rounded-md
//     textAlign: "center", // text-center
//     fontSize: 18, // text-lg
//   },
//   continueButton: {
//     backgroundColor: "#3b82f6", // bg-blue-500
//     paddingVertical: 8, // py-2
//     borderRadius: 8, // rounded-lg
//     alignItems: "center", // items-center
//   },
//   continueButtonText: {
//     color: "white", // text-white
//     fontWeight: "500", // font-medium
//   },
// });