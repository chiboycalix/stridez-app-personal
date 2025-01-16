export const Skeleton = () => {
  return (
    <div className="lg:w-[31rem] w-full space-y-20">
      <div className="animate animate-pulse col-span-1 py-2 rounded">
        <div className="flex w-full max-w-[26rem] lg:max-w-[30rem] lg:px-2 justify-center items-center">
          <div className="h-14 w-14 bg-slate-400 rounded-full"></div>
          <div className="flex flex-col gap-y-2 mx-2 flex-1">
            <div className="flex">
              <p className="mr-2 bg-slate-400 h-4 w-full rounded-md"></p>
              <p className="ml-auto  bg-slate-400 h-4 w-[10rem] rounded-md"></p>
            </div>
            <div className=" bg-slate-400 h-4 w-full rounded-md"></div>
          </div>
        </div>
        <div className="mt-3 lg:ml-[4.5rem] w-[26rem] h-[75vh] bg-slate-400 rounded-lg"></div>
      </div>
      <div className="animate animate-pulse col-span-1 py-2 rounded">
        <div className="flex w-full max-w-[26rem] lg:px-2 justify-center items-center">
          <div className="h-14 w-14 bg-slate-400 rounded-full"></div>
          <div className="flex flex-col gap-y-2 mx-2 flex-1">
            <div className="flex">
              <p className="mr-2 bg-slate-400 h-4 w-full rounded-md"></p>
              <p className="ml-auto  bg-slate-400 h-4 w-[10rem] rounded-md"></p>
            </div>
            <div className=" bg-slate-400 h-4 w-full rounded-md"></div>
          </div>
        </div>
        <div className="mt-3 lg:ml-[4.5rem] w-[26rem] h-[75vh] bg-slate-400 rounded-lg"></div>
      </div>
      <div className="animate animate-pulse col-span-1 py-2 rounded">
        <div className="flex w-full max-w-[26rem] lg:px-2 justify-center items-center">
          <div className="h-14 w-14 bg-slate-400 rounded-full"></div>
          <div className="flex flex-col gap-y-2 mx-2 flex-1">
            <div className="flex">
              <p className="mr-2 bg-slate-400 h-4 w-full rounded-md"></p>
              <p className="ml-auto  bg-slate-400 h-4 w-[10rem] rounded-md"></p>
            </div>
            <div className=" bg-slate-400 h-4 w-full rounded-md"></div>
          </div>
        </div>
        <div className="mt-3 lg:ml-[4.5rem] w-[26rem] h-[75vh] bg-slate-400 rounded-lg"></div>
      </div>
    </div>
  );
};
