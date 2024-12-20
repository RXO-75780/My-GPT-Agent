"use client";
import React, { useState, useEffect } from "react";
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
  const [displayedText, setDisplayedText] = useState("");

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
                key={index}
                p={2}
                borderRadius="10px"
                width="fit-content"
                maxWidth="80%"
                sx={{
                  display: "flex",
                  alignItems: "flex-start", // Align items to the top
                  gap: "8px", // Add consistent gap between icon and text
                  color: msg.role === "assistant" ? "#212529" : "#212529",
                  backgroundColor:
                    msg.role === "assistant" ? "#f8f9fa" : "#ced4da",
                }}
              >
                {/* Render the icon only for assistant responses */}
                {msg.role === "assistant" && (
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "flex-start", // Align the icon to the top
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#228B22" // Set icon color
                      width="20"
                      height="20"
                      style={{ flexShrink: 0 }} // Prevent resizing due to container changes
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Box>
                )}
                {/* Message Content */}
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
            aria-label="Type your message here"
            sx={{
              input: { color: "#212529" },
              "& .MuiOutlinedInput-root fieldset": { borderColor: "#212529" },
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            aria-label="Send message"
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
