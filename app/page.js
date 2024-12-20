"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import HackingAnimation from "./components/HackingAnimation";

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I’m here to share Rohith Reddy Odiseri’s background, skills, and projects.",
    },
  ]);
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef(null); // Reference for the chat container

  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty messages
    setMessage("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: message },
      { role: "assistant", content: "Typing..." },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) throw new Error("Network error");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: result },
        ]);
      }
    } catch (error) {
      console.error("Error while sending the message:", error);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the chat container whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Stack
      direction="row"
      width="100vw"
      height="100vh"
      sx={{
        backgroundColor: "#f8f9fa",
        overflow: "hidden",
      }}
    >
      {/* Left Side with Hacking Animation */}
      <Box
        width="25%"
        p={3}
        sx={{
          backgroundColor: "#212529",
          color: "#0f0",
          fontFamily: "monospace",
          overflow: "hidden",
          whiteSpace: "pre-line",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <HackingAnimation />
      </Box>

      {/* Main Content */}
      <Stack
        direction="column"
        width="75%"
        p={2}
        spacing={3}
        sx={{
          backgroundColor: "#f8f9fa",
          borderTopRightRadius: "10px",
          borderBottomRightRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* Typing Intro Text */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Press Start 2P', cursive",
              fontWeight: "bold",
              textAlign: "center",
              color: "#228B22",
              border: "2px solid #212529",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            Welcome to Rohith's Assistant
          </Typography>
          <style>
            {`
            @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

            @keyframes glow {
              0% {
                text-shadow: 0 0 5px #2E8B57, 0 0 10px #228B22, 0 0 20px #228B22;
              }
              100% {
                text-shadow: 0 0 10px #2E8B57, 0 0 20px #228B22, 0 0 40px #228B22;
              }
            }
          `}
          </style>
        </Box>

        {/* Chat Messages */}
        <Stack
          ref={chatContainerRef} // Reference to the chat container
          direction="column"
          flexGrow={1}
          overflow="auto"
          spacing={2}
          p={2}
          maxHeight="100%"
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                msg.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                p={2}
                borderRadius="10px"
                width="fit-content"
                maxWidth="80%"
                sx={{
                  color: msg.role === "assistant" ? "#212529" : "#212529",
                  backgroundColor:
                    msg.role === "assistant" ? "#f8f9fa" : "#ced4da",
                }}
              >
                <Typography>{msg.content}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Input Field and Button */}
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            sx={{
              input: { color: "#212529" },
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#212529" },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              backgroundColor: "#212529",
              color: "#f8f9fa",
              "&:hover": { backgroundColor: "#f8f9fa", color: "#212529" },
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
