import axiosClient from "./axiosClient";

export const getMyPlants = async (params = {}) => {
    const response = await axiosClient.get("/plants", {
        params,
    });

    return response.data;
};

export const getPlantById = async (id) => {
    const response = await axiosClient.get(`/plants/${id}`);

    return response.data.data.plant;
};

export const waterPlant = async (id, wateredDate) => {
    const response = await axiosClient.patch(`/plants/${id}/water`,
        wateredDate ? { wateredDate } : {});

    return response.data;
};

export const deletePlant = async (id) => {
    const response = await axiosClient.delete(`/plants/${id}`);

    return response.data;
};
export const checkPlantHealth = async (id, imageFile) => {
    const formData = new FormData();

    formData.append("image", imageFile);

    const response = await axiosClient.post(
        `/plants/${id}/checkin`,
        formData
    );

    return response.data;
};
export const updatePlant = async (id, updates) => {
    const response = await axiosClient.patch(
        `/plants/${id}`,
        updates
    )
    return response.data;
}
export const analyzeReidentification = async (id, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axiosClient.post(
        `/plants/${id}/re-identify`,
        formData
    );

    return response.data.data.analysis;
};

export const confirmReidentification = async (id, analysis) => {
    const response = await axiosClient.post(
        `/plants/${id}/re-identify/confirm`,
        analysis
    );

    return response.data;
};
