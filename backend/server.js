// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const QuillDelta = require('quill-delta'); // <<< THIS IS THE ONE TO KEEP. MAKE SURE THERE ARE NO OTHERS.

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

// --- Document Storage (In-Memory for this example) ---
const DOCUMENT_ID = "shared-doc-1";
// Ensure documentContent is initialized using the *single* QuillDelta declaration from above
let documentContent = new QuillDelta([{ insert: 'Hello Collaborative World!\n' }]);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.join(DOCUMENT_ID);
    console.log(`User ${socket.id} joined document ${DOCUMENT_ID}`);

    console.log(`Emitting 'load-document' to ${socket.id} with content:`, JSON.stringify(documentContent.ops));
    socket.emit('load-document', documentContent.ops);

    socket.on('send-changes', (delta) => {
        console.log(`Received delta from ${socket.id}:`, JSON.stringify(delta));
        try {
            // Ensure this uses the *single* QuillDelta declaration
            documentContent = documentContent.compose(new QuillDelta(delta));
            socket.to(DOCUMENT_ID).broadcast.emit('receive-changes', delta);
        } catch (err) {
            console.error("Error applying or broadcasting delta:", err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.get('/', (req, res) => {
  res.send('Backend server is running and ready for WebSocket connections.');
});

server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});