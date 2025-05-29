# Real-Time Collaborative Document Editor

This project is a web-based real-time collaborative document editor, allowing multiple users to edit the same document simultaneously and see each other's changes live.

## Features (Current / Planned)

*   **Real-time Collaboration:** Multiple users can edit a document at the same time.
*   **Rich Text Editing:** Supports basic formatting options (bold, italics, lists, etc.) using Quill.js.
*   **Live Updates:** Changes made by one user are instantly reflected for all other users viewing the same document.
*   **(Planned) User Authentication:** Secure user accounts and document ownership.
*   **(Planned) Document Management:** Ability to create, save, and list documents.
*   **(Planned) Presence Indicators:** Show which users are currently active in a document.
*   **(Planned) Cursor Tracking:** Display the cursor positions of other collaborators.

## Tech Stack

*   **Frontend:**
    *   React.js (or Vue.js) - For building a dynamic and responsive user interface.
    *   Quill.js - Rich text editor library.
    *   Socket.IO Client - For real-time communication with the backend.
*   **Backend:**
    *   Node.js with Express.js (or Python with Django/Flask) - For handling API requests and WebSocket connections.
    *   Socket.IO - For managing real-time bidirectional event-based communication.
    *   Quill Delta - For representing and manipulating document changes on the server.
*   **Database (Conceptual / Planned):**
    *   MongoDB (or PostgreSQL) - For storing user data and document content.
    *   *(Currently, the example uses in-memory storage for document content on the backend.)
