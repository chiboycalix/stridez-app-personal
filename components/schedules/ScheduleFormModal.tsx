"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CurrencyInput from "react-currency-input-field";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";

type ScheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    username: string;
    // Add other properties if available in the `currentUser` object
  };
};

type Currency = {
  code: string;
  symbol: string;
};

const currencyList: Currency[] = [
  { code: "NGN", symbol: "₦" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "CAD", symbol: "CA$" },
];

export default function ScheduleModal({
  isOpen,
  onClose,
  currentUser,
}: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [guestUsernames, setGuestUsernames] = useState<string[]>([]);
  const [currentGuestInput, setCurrentGuestInput] = useState<string>("");
  const [coGuestUsernames, setCoGuestUsernames] = useState<string[]>([]);
  const [currentCoGuestInput, setCurrentCoGuestInput] = useState<string>("");
  const [isPaymentEnabled, setIsPaymentEnabled] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [guestSuggestions, setGuestSuggestions] = useState<string[]>([]);
  const [coGuestSuggestions, setCoGuestSuggestions] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<string>("");

  const fetchUsernames = useCallback(
    async (
      query: string,
      setSuggestions: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      if (!query) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`${baseUrl}/users/?username=${query}`);
        const data = await response.json();
        setSuggestions(
          data.data.map((user: { username: string }) => user.username)
        );
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    },
    []
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsernames(currentGuestInput, setGuestSuggestions);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentGuestInput, fetchUsernames]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsernames(currentCoGuestInput, setCoGuestSuggestions);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentCoGuestInput, fetchUsernames]);

  const handleGuestSelect = (username: string) => {
    if (!guestUsernames.includes(username)) {
      setGuestUsernames([...guestUsernames, username]);
    }
    setCurrentGuestInput("");
    setGuestSuggestions([]);
  };

  const handleCoGuestSelect = (username: string) => {
    if (!coGuestUsernames.includes(username)) {
      setCoGuestUsernames([...coGuestUsernames, username]);
    }
    setCurrentCoGuestInput("");
    setCoGuestSuggestions([]);
  };

  const removeGuestUsername = (index: number) => {
    setGuestUsernames(guestUsernames.filter((_, i) => i !== index));
  };

  const removeCoGuestUsername = (index: number) => {
    setCoGuestUsernames(coGuestUsernames.filter((_, i) => i !== index));
  };

  const handleGuestKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.key === "Enter" || event.key === ",") &&
      currentGuestInput.trim() !== ""
    ) {
      event.preventDefault();
      setGuestUsernames([...guestUsernames, currentGuestInput.trim()]);
      setCurrentGuestInput("");
    }
  };

  const handleCoGuestKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      (event.key === "Enter" || event.key === ",") &&
      currentCoGuestInput.trim() !== ""
    ) {
      event.preventDefault();
      setCoGuestUsernames([...coGuestUsernames, currentCoGuestInput.trim()]);
      setCurrentCoGuestInput("");
    }
  };

  const validateForm = (): boolean => {
    if (isPaymentEnabled && (!paymentAmount || !selectedCurrency)) {
      setFormErrors("Amount and currency are required for paid schedules.");
      return false;
    }
    setFormErrors("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = {
      title: (event.target as any).title.value,
      description: (event.target as any).description.value || "",
      startTime: (event.target as any).startTime.value,
      endTime: (event.target as any).endTime.value,
      date: selectedDate.toISOString(),
      timezone: (event.target as any).timezone.value,
      isPaid: isPaymentEnabled,
      amount: isPaymentEnabled ? paymentAmount : 0,
      currency: isPaymentEnabled ? selectedCurrency : "",
      guests: guestUsernames,
      coGuides: coGuestUsernames,
    };

    try {
      const response = await fetch(`${baseUrl}/schedules/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Schedule created successfully:", result);
        onClose();
      } else {
        console.log("Error creating schedule:", result);
      }
    } catch (error) {
      console.log("Network error:", error);
    }
  };

  const renderDropdown = (
    suggestions: string[],
    onSelect: (username: string) => void
  ) => {
    if (!suggestions.length) return null;
    return (
      <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
        {suggestions.map((username, index) => (
          <li
            key={index}
            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
            onClick={() => onSelect(username)}
          >
            {username}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50"
          onClick={onClose}
        >
          {/* Modal content */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
