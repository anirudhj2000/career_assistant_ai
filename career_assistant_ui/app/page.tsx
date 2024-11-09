"use client"
import React, { useState, useRef } from 'react';

export default function Home() {
  const [isStreaming, setIsStreaming] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startStreaming = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert('Your browser does not support audio recording.');
      return;
    }

    // Request permission to access the microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const socket = new WebSocket('wss://localhost:3001/abcd');
    socketRef.current = socket;

    // console.log("web", socketRef.current)

    // socket.addEventListener('open', () => { console.log("open") })


    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsStreaming(true);

      // Set up the MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      };

      mediaRecorder.start(100); // Send audio chunks every 100ms
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsStreaming(false);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsStreaming(false);
    };

  };

  const stopStreaming = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    setIsStreaming(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Audio Streaming to WebSocket</h1>
      <button onClick={isStreaming ? stopStreaming : startStreaming}>
        {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
      </button>
    </div>
  );
}