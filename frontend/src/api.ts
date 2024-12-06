/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from "antd";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json();
}

export async function apiGet(endpoint: string) {
  try {
    const response = await fetch(`/tony${endpoint}`);
    return await handleResponse(response);
  } catch (e: any) {
    displayError(e.message || "an err occurred");
    throw e;
  }
}

export async function apiPost(endpoint: string, data: any) {
  try {
    const response = await fetch(`/tony${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  } catch (e: any) {
    displayError(e.message || "an err occurred");
    throw e;
  }
}

export const apiDelete = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
    });
    return await handleResponse(response);
  } catch (e: any) {
    displayError(e.message || "an err occurred");
    throw e;
  }
};

function displayError(errorMessage: string) {
  message.error({
    content: errorMessage,
    duration: 5,
    type: "error",
  });
}
