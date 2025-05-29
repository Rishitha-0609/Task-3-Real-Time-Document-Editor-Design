// frontend/src/EditorComponent.js
import React, { useEffect, useRef, useState, useCallback } from 'react'; // Added useCallback
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';
const DOCUMENT_ID = "shared-doc-1";

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ align: [] }],
    ['image', 'blockquote', 'code-block'],
    ['clean'],
];

function EditorComponent() {
    const [socket, setSocket] = useState(null);
    const [quill, setQuill] = useState(null);
    // No longer using editorRef, directly using the callback ref
    // const editorRef = useRef(null);

    // Callback ref for Quill initialization
    const quillRef = useCallback((wrapper) => {
        if (wrapper == null) return; // If the div is removed, do nothing

        wrapper.innerHTML = ''; // Clear any previous content
        const editor = document.createElement('div');
        wrapper.append(editor);

        const q = new Quill(editor, {
            theme: 'snow',
            modules: { toolbar: TOOLBAR_OPTIONS },
        });
        q.disable();
        q.setText('Loading document...');
        setQuill(q); // Set the Quill instance to state

        // Cleanup function for when the component unmounts or ref changes
        return () => {
            // wrapper.innerHTML = ''; // Clean up the DOM, optional
            // If Quill had a proper destroy method, you'd call it here
            // q.destroy();
        };
    }, []); // Empty dependency array, so this callback is stable

    // 2. Initialize Socket.IO connection
    useEffect(() => {
        console.log("Attempting to connect to Socket.IO server...");
        const s = io(SERVER_URL);
        setSocket(s);

        s.on('connect', () => {
            console.log("Connected to Socket.IO server with ID:", s.id);
        });
        s.on('connect_error', (err) => {
            console.error("Socket.IO connection error:", err.message, err.description, err.data);
        });
        s.on('disconnect', (reason) => {
            console.log("Socket.IO disconnected:", reason);
        });

        return () => {
            console.log("Disconnecting Socket.IO");
            s.disconnect();
        };
    }, []);

    // 3. Load document and handle incoming changes
    useEffect(() => {
        if (socket == null || quill == null) return;
        console.log("Effect: Load document / Receive changes - Socket & Quill ready");

        const handleLoadDocument = (documentOps) => {
            console.log("Loading document from server:", documentOps);
            quill.setContents(documentOps);
            quill.enable();
        };
        socket.once('load-document', handleLoadDocument);

        const handleReceiveChanges = (delta) => {
            console.log("Received remote delta:", delta);
            quill.updateContents(delta);
        };
        socket.on('receive-changes', handleReceiveChanges);

        // Request to join the document (if your server requires an explicit join event)
        // socket.emit('join-document', DOCUMENT_ID); // Server already auto-joins in current setup

        return () => {
            console.log("Cleaning up document/receive listeners");
            socket.off('load-document', handleLoadDocument);
            socket.off('receive-changes', handleReceiveChanges);
        };
    }, [socket, quill]); // Rerun if socket or quill instance changes

    // 4. Handle local changes and send them to the server
    useEffect(() => {
        if (socket == null || quill == null) return;
        console.log("Effect: Send changes - Socket & Quill ready");

        const handleChange = (delta, oldDelta, source) => {
            if (source !== 'user') return;
            console.log("Local change, sending delta:", delta);
            socket.emit('send-changes', delta);
        };
        quill.on('text-change', handleChange);

        return () => {
            console.log("Cleaning up text-change listener");
            quill.off('text-change', handleChange);
        };
    }, [socket, quill]); // Rerun if socket or quill instance changes

    // The div where Quill will be mounted
    return <div className="editor-container" ref={quillRef}></div>;
}

export default EditorComponent;