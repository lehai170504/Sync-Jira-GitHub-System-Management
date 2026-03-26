"use client";

import { useMutation } from "@tanstack/react-query";
import { postProjectChatApi, type ProjectChatRequest } from "../api/project-chat-api";

export function useProjectChat() {
  return useMutation({
    mutationFn: (payload: ProjectChatRequest) => postProjectChatApi(payload),
  });
}

