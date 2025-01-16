const VideoMutedDisplay = ({ participant }: any) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-800 rounded-lg">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-xl text-white">
          {participant.name?.[0]?.toUpperCase() || participant.isLocal ? 'Y' : 'U'}
        </div>
        <p className="mt-2 text-white text-sm">
          {participant.isLocal ? 'You' : participant.name || `User ${participant.uid}`}
        </p>
      </div>
    </div>
  );
};

export default VideoMutedDisplay;