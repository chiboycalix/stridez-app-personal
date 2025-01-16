import React from "react";

const Search = () => {
  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg w-96 p-4">
      <h3 className="font-semibold mb-2">Recently searched</h3>
      <ul>
        <li className="flex justify-between">
          How to swim with a shark
          <button className="text-gray-500 hover:text-red-500">×</button>
        </li>
        <li className="flex justify-between">
          How to sew
          <button className="text-gray-500 hover:text-red-500">×</button>
        </li>
        <li className="text-red-500 cursor-pointer">Clear all</li>
      </ul>
      <h3 className="font-semibold mt-4 mb-2">Popular searched</h3>
      <ul>
        <li>How to fly a plane</li>
        <li>How to create animated gifs</li>
        <li>How to build an iOS app</li>
        <li>How to create designs with Figma</li>
      </ul>
    </div>
  );
};

export default Search;
