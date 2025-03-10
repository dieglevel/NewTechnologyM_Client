import { Dispatch, SetStateAction } from "react";


export const fetchUser = async (setUser: Dispatch<SetStateAction<{ name: string; mainAvatar: string; coverAvatar: string }>>) => {
    await fetch("https://6458b0cb4eb3f674df7a6ab2.mockapi.io/users/1").then((response) => {
        response.json().then((data) => {
            setUser(data);
        });
    });
}