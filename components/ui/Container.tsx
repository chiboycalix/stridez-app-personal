import React from 'react';

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-[7.2rem] ml-[90px] 2xl:pl-[17rem] lg:pl-[17.125rem] lg:pr-0 w-[calc(100%-3.2rem)] pr-3 max-w-[1800px] lg:mx-auto">
      <div className="py-1 px-2 rounded-md bg-slate-100 w-full">{children}</div>
    </div>
  );
}
