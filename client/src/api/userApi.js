import axiosClient from './axiosClient';

export const getUserData = async () => {
    const response = await axiosClient.get('/user/user-data')
    return response.data
};
export const updateUserProfile = async (profileData)=>{
    const response = await axiosClient.patch('/user/profile',profileData)
    return response.data
}
export const changePassword = async(passwordData)=>{
    const response = await axiosClient.patch('/user/change-password',passwordData)
    return response.data
}