import { Api } from "../config";
import { IAddCustomer, IGetCustomersApiResponse } from "./customer.type";



export const AddCustomer = async (data: IAddCustomer) => {
    return (await Api.post("/customer/manual-kyc", data)).data;
}


export const getCustomers = async (): Promise<IGetCustomersApiResponse>  => {
    return (await Api.get("/customer/list")).data;
}



