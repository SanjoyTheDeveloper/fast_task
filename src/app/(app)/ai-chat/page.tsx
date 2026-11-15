"use client";

import * as React from "react";
import { AiChatBoard } from "@/components/chat/AiChatBoard";
import { useStudentProfile } from "@/lib/studentProfile";

export default function AiChatPage() {
  const { profile } = useStudentProfile();

  const user = {
    name: profile?.name || "Sanjoy Chandro Bhowmick",
    email: "sanjoy@fasttask.app",
    image: null,
  };

  return (
    <div className="w-full h-full min-h-[calc(100vh-3.5rem)] md:min-h-screen bg-white">
      <AiChatBoard user={user} />
    </div>
  );
}
