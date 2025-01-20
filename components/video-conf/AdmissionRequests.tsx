import { useVideoConferencing } from "@/context/VideoConferencingContext";
import { AdmissionNotification } from "./AdmissionNotification";

export const AdmissionRequests = () => {
  const {
    waitingParticipants,
    handleAdmissionResponse,
  } = useVideoConferencing();

  if (Object.keys(waitingParticipants).length === 0) return null;

  return (
    <>
      {Object.entries(waitingParticipants).map(([uid, participant]: any) => (
        <AdmissionNotification
          key={uid}
          requesterName={participant.name}
          onAllow={() => handleAdmissionResponse(uid, true)}
          onDeny={() => handleAdmissionResponse(uid, false)}
        />
      ))}
    </>
  );
};