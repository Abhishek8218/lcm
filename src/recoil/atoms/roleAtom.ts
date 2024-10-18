
import { atom } from "recoil";
import Cookies from 'js-cookie';




  const role = Cookies.get('userRole');
  console.log('role', role);

export const userRoleState = atom({
    key: 'userRoleState', // Unique ID (with respect to other atoms/selectors)
    default:  role // Default value (aka initial value)
  });
  