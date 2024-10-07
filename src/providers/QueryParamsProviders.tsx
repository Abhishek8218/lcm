'use client';

import React from 'react';
import { QueryParamProvider } from 'use-query-params';
import NextAdapterApp from 'next-query-params/app';
const NextQueryParamProvider = ({ children }: { children: React.ReactNode }) => {
  return (

      <div>
        <QueryParamProvider adapter={NextAdapterApp}>
          {children}
        </QueryParamProvider>
      </div>

  );
}


export default NextQueryParamProvider