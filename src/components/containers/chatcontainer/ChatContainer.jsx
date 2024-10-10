import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";

const ChatContainer = () => {
  const [msg, setMsg] = useState("");
  const [chatRes, setChatRes] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const API_KEY = "AIzaSyDFQ8TFo7E2ytpTkYI-g1IuACe2yRLtq-I";

  const getGeminiData = async () => {
    if (!msg.trim()) {
      return;
    }

    // Build the conversation parts from chat history
    const conversationParts = chatHistory.flatMap((item) => [
      { role: "user", parts: [{ text: item[0].message }] }, // User's message
      { role: "model", parts: [{ text: item[1].message }] }, // AI's response
    ]);

    // Add the current user message to the conversation
    conversationParts.push({
      role: "user",
      parts: [{ text: msg }],
    });

    const requestBody = {
      contents: conversationParts,
    };

    try {
      let response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data = response.data;
      let chatData = data.candidates[0].content.parts[0].text;
      setChatRes(chatData);
      setChatHistory([
        ...chatHistory,
        [
          { role: "human", message: msg },
          { role: "ai", message: chatData },
        ],
      ]);
      setMsg("");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(chatHistory);
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "600px",
        margin: "auto",
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        GrowMore Chatbot
      </Typography>

      {/* Display chat history */}
      <Box
        sx={{
          height: "400px",
          overflowY: "scroll",
          backgroundColor: "#f9f9f9",
          padding: 2,
          borderRadius: "8px",
          marginBottom: 2,
        }}
      >
        {chatHistory.length > 0 ? (
          chatHistory.map((chat, index) => (
            <Box key={index} mb={2}>
              <Paper
                elevation={1}
                sx={{
                  padding: 2,
                  backgroundColor: "#e0f7fa",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  User:
                </Typography>
                <Typography variant="body2">{chat[0].message}</Typography>
              </Paper>

              <Paper
                elevation={1}
                sx={{
                  padding: 2,
                  backgroundColor: "#ffe0b2",
                  marginTop: 1,
                  borderRadius: "8px",
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  GrowMore:
                </Typography>
                <Typography variant="body2">
                  <ReactMarkdown>{chat[1].message}</ReactMarkdown>
                </Typography>
              </Paper>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No chat history yet.</Typography>
        )}
      </Box>

      {/* User input and button */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          label="Type your message..."
          variant="outlined"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={getGeminiData}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatContainer;
