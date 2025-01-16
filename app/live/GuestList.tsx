// GuestList.js
import React, { useState} from "react";

interface Subscriber {
  userId: string;
  username: string;
  isCoHost: boolean;
  isOwner: boolean;
}

interface GuestListProps {
  roomSubscribers: Subscriber[];
}

const GuestList: React.FC<GuestListProps> = ({ roomSubscribers }) => {
  const guests = roomSubscribers?.filter(subscriber => subscriber?.isCoHost === false && subscriber?.isOwner === false);
   console.log('guests:', guests);
  return (
    <div>
      <ul>
        {guests?.length > 0 ? (
          guests?.map(coHost => <li key={coHost.userId}>{coHost.username}</li>)
        ) : (
          <li>N/A</li>
        )}
      </ul>
    </div>
  );
};

export default GuestList;
