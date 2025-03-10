import React from 'react';
import { View, TextInput } from 'react-native';

interface OTPInputProps {
  otp: string[];
  inputRefs: any[];
  handleOtpChange: (value: string, index: number) => void;
}

export function OTPInput({ otp, inputRefs, handleOtpChange }: OTPInputProps) {
  return (
    <View className="flex-row justify-center space-x-2 mb-5">
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          className={`w-12 h-14 border-2 rounded-lg text-center text-lg
            ${digit ? 'border-blue-500' : 'border-gray-300'}`}
          maxLength={1}
          keyboardType="number-pad"
          value={digit}
          onKeyPress={(e) => handleOtpChange(e.nativeEvent.key, index)}
          onChangeText={(value) => handleOtpChange(value, index)}
        />
      ))}
    </View>
  );
}