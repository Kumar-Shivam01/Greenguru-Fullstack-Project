import axiosClient from "./axiosClient";

export const getMyPlants = async (params = {}) => {
    const response = await axiosClient.get("/plants", {
        params,
    });

    return response.data;
};

export const getPlantById = async (id) => {
    const response = await axiosClient.get(`/plants/${id}`);

    return response.data;
};

export const waterPlant = async (id, wateredDate) => {
    const response = await axiosClient.patch(`/plants/${id}/water`, {
        wateredDate,
    });

    return response.data;
};

export const deletePlant = async (id) => {
    const response = await axiosClient.delete(`/plants/${id}`);

    return response.data;
};