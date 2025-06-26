import { ENDPOINTS } from "../config/urls.js";

const API_KEY = "TutorologyApiKey";

// This function fetches all classes along with the unread messsage count
// for each user from the server and returns the data in JSON format.
export const fetchAllMessages = async () => {
  const res = await fetch(ENDPOINTS.GET_ALL_MESSAGES, {
    headers: {
      "Content-Type": "application/json",
      "api-key": API_KEY,
    },
  });
  return res.json();
};

// This function updates the unread message count for a specific class
// INPUT PARAMETERS: classId - id of the class for which we need to make changes
// userId - id of the user who has send the message
export const updateUnreadMessages = (classId, senderId) => {
  return fetch(
    `${ENDPOINTS.UPDATE_UNREAD_MESSAGES}?classId=${classId}&senderId=${senderId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", "api-key": API_KEY },
      body: JSON.stringify({ name: "shashank" }), // 🔧 Optional: Make this dynamic
    }
  );
};

// This function calls the api to update the message count for the user to 0 of the
// particular class and returns the updated count

// INPUT PARAMETERS: classId - id of the class for which we need to make changes
// userId - id of the user for which we need to make changes
export const markMessagesSeen = async (classId, userId) => {
  const response = await fetch(
    `${ENDPOINTS.MESSAGES_SEEN}?classId=${classId}&user_id=${userId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", "api-key": API_KEY },
      body: JSON.stringify({ name: "shashank" }),
    }
  );
  return response.json();
};
