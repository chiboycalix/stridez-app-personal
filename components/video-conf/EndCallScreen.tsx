import { Button } from "@/components/ui/button";
import { HandIcon, Share } from "lucide-react";

const EndCallScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 bg-primary-950 bg-opacity-30">
      <HandIcon className="w-16 h-16 text-amber-400 mb-6" />
      <h2 className="text-3xl font-semibold mb-2 text-white">You left the meeting</h2>
      <p className="text-gray-400 mb-6">Have a nice day!</p>
      <div className='flex items-center gap-4'>
        <p className="text-gray-400 mb-2 text-sm">Left by mistake?</p>
        <Button
          onClick={() => { }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Share className="w-4 h-4" />
          Rejoin
        </Button>
      </div>
    </div>
  );
};
export default EndCallScreen