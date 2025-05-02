import { ErrorResponse } from "@/libs/axios/axios.config";
import { initDetailInformation, initMyListFriend, initRequestFriend, initRoom, initSendedFriend } from "@/libs/redux";
import { store } from "@/libs/redux/redux.config";
import { getListFriend, getListResponseFriend, getListSended, getProfile, getRoom } from "@/services";

const initialListRoom = async () => {
    try {
        const response = await getRoom();
        if (response?.statusCode === 200) {
            store.dispatch(initRoom(response.data.listRoomResponse));
        }
    } catch (error) {
        const e = error as ErrorResponse;
    }
}

const initialListFriend = async () => {
    try {
        const response = await getListFriend();
        if (response?.statusCode === 200) {
            store.dispatch(initMyListFriend(response.data));
        }
    } catch (error) {
        const e = error as ErrorResponse;
    }
}

const initialListSended = async () => {
    try {
        const response = await getListSended();
        if (response?.statusCode === 200) {
            store.dispatch(initSendedFriend(response.data));
        }
    } catch (error) {
        const e = error as ErrorResponse;
    }
}

const initialListResponseFriend = async () => {
    try {
        const response = await getListResponseFriend();
        if (response?.statusCode === 200) {
            store.dispatch(initRequestFriend(response.data));
        }
    } catch (error) {
        const e = error as ErrorResponse;
    }
}

const initialMyDetailInformation = async () => {
    try {
        const response = await getProfile();
        if (response?.statusCode === 200) {
            store.dispatch(initDetailInformation(response.data));
        }
    } catch (error) {
        const e = error as ErrorResponse;
    }
}



export const initialDataPage = async () => {
    initialMyDetailInformation()
    initialListRoom()
    initialListFriend()
    initialListSended()
    initialListResponseFriend()
}