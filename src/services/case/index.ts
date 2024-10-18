import { Api } from "../config";
import { INewCase } from "./case.types";



export const newCase = async (data: INewCase) => {
    return (await Api.post("/customer/manual-kyc", data)).data;
}