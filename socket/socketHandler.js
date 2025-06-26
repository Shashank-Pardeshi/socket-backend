import {
  fetchAllMessages,
  updateUnreadMessages,
  markMessagesSeen,
} from "./messageService.js";

export const registerSocketEvents = (socket, io) => {
  // console.log("New client connected:", socket.id);

  // this is used to Handles the "joinClass" event where we join the socket of the user
  // to the rooms for each claas they are part of.
  // after joining the user to necessary classes the function emits a messageCount event to the uesr
  // with the data of the classes along with the number of unread messages the user has in that class
  // the unread message data is received from the fetchMessages function

  // INPUT PARAMETERS : class_ids - it is array of class ids the user is a part of.
  // OUTPUT : It emits a event messageCount

  socket.on("joinClass", async ({ class_ids }) => {
    // console.log(`${socket.id} is joining classes:`, class_ids);

    class_ids.forEach((classId) => {
      socket.join(classId);
      // console.log(`${socket.id} joined class: ${classId}`);
    });

    const allClasses = await fetchAllMessages();
    // console.log("Sending message count data to all joined classes");

    io.to(socket.id).emit("messageCount", allClasses.data);
  });

  // this is used to Handles the "sendMessage" event where we update the unread messages count in the database
  // whenever any user send a message to any class we call the updateUnreadMessages function which
  // updates the unread message count for other users in the same class in which the user has send
  // after updating the message count in the database we emit a event receiveMessage to all the members of the
  // class with the class id and the content of the message send by the user

  //INPUT PARAMETERS :  class_id - it is the id of the class in which the user has send the message
  // sender_id - it is the id of the user who has send the message
  // content - it is the content of the message send by the user

  socket.on("sendMessage", async ({ class_id, sender_id, content }) => {
    const updatedData = await updateUnreadMessages(class_id, sender_id);

    if (updatedData.ok) {
      io.to(class_id).emit("receiveMessage", { class_id, content });
    }
  });

  // this is used to Handles the "classOpened" event where we mark the messages as seen
  // whenever any user opens the class we call the markMessagesSeen function which
  // updates the message count for the user in the database to 0 for that class
  // after updating the message count in the database we emit a event classOpened to all the members of the

  // INPUT PARAMETERS : class_id - it is the id of the class which the user has opened
  //  user_id - it is the id of the user who has opened the class

  socket.on("classOpened", async ({ class_id, user_id }) => {
    const data = await markMessagesSeen(class_id, user_id);
    io.to(class_id).emit("classOpened", { class_id, user_id });

    // console.log("updatedData after open", data?.messageCount);
  });

  // this is used to Handles the "sameClass" event where we mark the messages as seen
  // whenever there comes a message to a user to a class which the user is active in we
  // updates the message count for the user in the database to 0 for that class

  // INPUT PARAMETERS : class_id - it is the id of the class which the user has opened
  //  user_id - it is the id of the user who has opened the class

  socket.on("sameClass", async ({ class_id, user_id }) => {
    const data = await markMessagesSeen(class_id, user_id);
  });

  // this is used to Handles the "disconnect" event where we remove the socket of the user

  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
  });
};
