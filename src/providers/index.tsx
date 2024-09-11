''

import { Suspense } from "react";
import QueryProvider from "./QueryProvider";
import RecoilContextProvider from "./RecoilProvider";
import { Toaster } from "react-hot-toast";
import { LucideLoader2 } from "lucide-react";

export const Providers = ({children}: {children:  React.ReactNode})=> {
  return (
    <Suspense fallback={<div><LucideLoader2 size={32} className="absolute animate-spin top-1/2 left-1/2"/></div>}>

    <QueryProvider>
      <RecoilContextProvider>
        <Toaster />
        {children}
      </RecoilContextProvider>
    </QueryProvider>
 

    </Suspense>
  );
}


