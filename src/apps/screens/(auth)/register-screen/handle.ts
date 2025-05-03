import { api } from "@/libs/axios/axios.config";
import { loginApi } from "@/services/auth";
import { Dispatch, SetStateAction } from "react";
import Toast from "react-native-toast-message";

export const checkRegister = (identify: string, password: string, rePassword: string, setError: Dispatch<SetStateAction<{
        errorIdentify: string;
        errorPassword: string;
        errorRePassword: string;
}>>): boolean => {
        if (!identify || !password || !rePassword) {
                setError({
                        errorIdentify: identify ? "" : "Vui lòng nhập số điện thoại hoặc email",
                        errorPassword: password ? "" : "Vui lòng nhập mật khẩu",
                        errorRePassword: rePassword ? "" : "Vui lòng nhập lại mật khẩu",
                });
                return false;
        }
        if (password !== rePassword) {
                setError({
                        errorIdentify: "",
                        errorPassword: "",
                        errorRePassword: "Mật khẩu không khớp",
                });

                return false;
        }

        // 8 từ , phải có số và chữ đi
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
                setError({
                        errorIdentify: "",
                        errorPassword: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số",
                        errorRePassword: "",
                });
                return false;
        }

        setError({
                errorIdentify: "",
                errorPassword: "",
                errorRePassword: "",
        })

        // check is 10 digit phone number === true
        const isPhoneNumber = identify.match(/^\d{10}$/);
        if (isPhoneNumber) {
                if (identify[0] !== "0") {
                        setError({
                                errorIdentify: "Số điện thoại không hợp lệ",
                                errorPassword: "",
                                errorRePassword: "",
                        });
                        return false;
                }
        }
        // check if email === true
        const isEmail = identify.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        if (isEmail) {
                if (!identify.includes("@")) {
                        setError({
                                errorIdentify: "Email không hợp lệ",
                                errorPassword: "",
                                errorRePassword: "",
                        });
                        return false;
                }
        }


        return true;
}