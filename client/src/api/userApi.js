import axiosClient from './axiosClient';

export const getUserData = async () => {
    const response = await axiosClient.get('/user/user-data')
    return response.data
};