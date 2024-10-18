import { Api } from "../config";



export const login = async (data: { userName: string; password: string }) => {
    return (await Api.post("/login", data)).data;
}


export const  validateToken = async () => {
    return (await Api.post("/validate-token")).data;
}