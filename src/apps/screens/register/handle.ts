import { Dispatch, SetStateAction } from "react";

   export const fetchdata = (setOtp: Dispatch<SetStateAction<string[]>>) => {
        setOtp(["", "", "", "", "", ""]);
}