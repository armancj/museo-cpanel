# AI Features Documentation

This document provides information about the AI features implemented in the Museo-CPanel application.

## Overview

The application includes two main AI features:
1. **Floating AI Chat Widget** - A chat interface that allows users to interact with an AI assistant from anywhere in the application
2. **AI Models Configuration** - A page that allows superadmin users to manage AI models

## Floating AI Chat Widget

The Floating AI Chat Widget provides a conversational interface where users can ask questions about the museum and its collections from any page in the application.

### Usage

1. Click on the chat icon in the bottom-right corner of any page
2. The chat widget will expand, showing the conversation interface
3. Type your question in the input field at the bottom of the chat
4. Press Enter or click the send button to submit your question
5. The AI will process your question and provide a response
6. Click the X button on the chat widget or the chat icon again to close the chat

### Technical Details

- The chat interface makes POST requests to `/ai/chat` with the prompt in the request body
- Example request:
  ```json
  {
    "prompt": "hablame sobre el machete de antonio maseo"
  }
  ```
- The response is displayed in the chat interface

## AI Models Configuration

The AI Models Configuration page allows superadmin users to view and manage the AI models used by the chat feature.

### Access Control

This page is only accessible to users with the "super Administrador" role. Other users will see an "Access Denied" message.

### Features

- View a list of available AI models
- See which models are installed
- Install new models

### Model Installation

1. Click the "Instalar Modelo" button
2. Enter the name of the model to install (default: "tinyllama")
3. Click "Instalar" to start the installation process

### Technical Details

- The page makes GET requests to `/ai/models` to fetch the list of available models
- It makes POST requests to `/ai/models/install` to install new models
- Example installation request:
  ```json
  {
    "modelName": "tinyllama"
  }
  ```
- If no model name is specified, the default "tinyllama" model is used

## Implementation Notes

- Both features are implemented as client-side components using Next.js and React
- The UI is built using PrimeReact components
- Authentication and authorization are handled using the existing mechanisms in the application
- The AI chat is available to all authenticated users
- The AI models configuration is restricted to superadmin users only
