
import { Api } from "../config";

export const AddUser = async (data: { userName: string;role: string, password: string }) => {
    return (await Api.post("/add-user", data)).data;
}
