import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { ActionButtons, Header, InfoBox, OTPInput } from '../components';


export const OTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-6">
        <Header />
        <OTPInput 
          otp={otp}
          inputRefs={inputRefs}
          handleOtpChange={handleOtpChange}
        />
        <InfoBox />
        <ActionButtons />
      </View>
    </SafeAreaView>
  );
}