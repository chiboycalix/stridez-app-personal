import React from 'react';

const SubscriptionModal = ({ isOpen, onClose, subscribedGuides }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-1/4">
        <h2 className="text-sm font-normal mb-4">
          This is a list of guides you are subscribed to
        </h2>
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="overflow-y-auto max-h-64">
          {subscribedGuides.map((guide, index) => (
            <div key={index} className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img
                  src={guide.profilePic}
                  alt={guide.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <span className='font-normal text-sm'>{guide.name}</span>
              </div>
              <button className="bg-gray-100 text-purple-500 border boder-solid font-normal text-sm t px-4 py-1 rounded">
                Subscribed
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SubscriptionModal;
