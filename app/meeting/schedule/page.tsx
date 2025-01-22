"use client";
import React from "react";
import Input from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { BiCaretDown } from "react-icons/bi";
import { Button } from "@/components/ui/button";

export default function Schedule() {
  const router = useRouter();

  return (
    <div className="p-8 bg-white flex items-start justify-between">
      <div className="basis-3/12">
        <button
          onClick={() => router.push("/meeting")}
          className="bg-gray-100 hover:text-gray-700 rounded-full p-2"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1">
        <form>
          <div className="mb-7">
            <Input label="Add webinar Title" />
          </div>
          <div className="mb-7">
            <Input
              label="Add Description"
              variant="textarea"
              placeholder="Meeting description"
            />
          </div>

          <div className="mb-7">
            <Input
              variant="datePicker"
              label="Date"
              rightIcon={<BiCaretDown />}
              onDateSelect={(date) => {
                console.log("Selected date:", date);
              }}
              selectedDate={new Date()}
              className="w-full"
            />
          </div>

          <div className="mb-7">
            <Input
              variant="timeRangePicker"
              label="Select Time Range"
              onTimeRangeSelect={(range) => {
                console.log("Selected time range:", range);
              }}
              selectedTimeRange={{
                from: "",
                to: "",
              }}
              className="w-full"
            />
          </div>
          <div className="mb-7">
            <div className="flex items-center gap-2 group hover:bg-primary-600 cursor-pointer px-2 py-1 rounded-sm w-2/12">
              <Checkbox checkIconClass="group-hover:text-primary group-hover:bg-white" />
              <p className="text-sm group-hover:text-white">All Day</p>
            </div>
          </div>

          <div className="mb-7">
            <div className="flex items-center gap-2 group hover:bg-primary-600 cursor-pointer px-2 py-1 rounded-sm w-2/12">
              <Checkbox checkIconClass="group-hover:text-primary group-hover:bg-white" />
              <p className="text-sm group-hover:text-white">Repeat Event</p>
            </div>
          </div>
          <div className="mb-7">
            <Input
              label="Add Guest"
              variant="textarea"
              placeholder="Enter Guests"
              resize="none"
            />
          </div>
          <div className="flex items-center justify-between mb-7">
            <p>Add Payment</p>
            <Switch />
          </div>
          <div>
            <Button className="w-full">Save</Button>
          </div>
        </form>
      </div>
      <div className="basis-3/12"></div>
    </div>
  );
}
