import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function WaitingRoomDialog() {
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Waiting for Admission</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          <p className="text-center text-gray-600">
            Please wait while a participant admits you to the meeting.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}