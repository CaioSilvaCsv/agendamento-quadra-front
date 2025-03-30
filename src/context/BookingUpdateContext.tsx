"use client";
import { createContext, useContext, useState } from "react";

const BookingUpdateContext = createContext({
  updated: false,
  triggerUpdate: () => {},
});

export function BookingUpdateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [updated, setUpdated] = useState(false);

  const triggerUpdate = () => {
    setUpdated((prev) => !prev);
  };

  return (
    <BookingUpdateContext.Provider value={{ updated, triggerUpdate }}>
      {children}
    </BookingUpdateContext.Provider>
  );
}

export function useBookingUpdate() {
  return useContext(BookingUpdateContext);
}
