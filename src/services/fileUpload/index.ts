import { Api } from "../config";
import { TFileUploadResponse } from "./fileUpload.type";

export const FileUpload = async (file: File): Promise<TFileUploadResponse> => {
    // Create a new FormData object
    const formData = new FormData();
    // Append the file to the FormData object
    formData.append("file", file);
    // Log FormData contents for debugging

// Use the appropriate key expected by the backend

    // Send the request
    return (await Api.post("/file/save", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })).data;
};


export const ImageDelete = async (url: string | undefined): Promise<TFileUploadResponse> => {
    return (await Api.post("/file/remove", { url })).data;
};