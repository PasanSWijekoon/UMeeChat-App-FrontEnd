Here’s the **README** file for the **UMeeChat frontend** (React Native):

---

# UMeeChat - Frontend (React Native)

## Overview

UMeeChat is a real-time chat application designed for seamless communication between users. The frontend of UMeeChat is built using **React Native** to provide a cross-platform mobile experience. It includes user authentication, real-time messaging, and profile management features. The frontend interacts with the backend (Java EE + Hibernate) through REST APIs.

## Features

- **User Sign Up**: Register with mobile number, first and last name, password, and profile image upload.
- **User Sign In**: Login with mobile number and password.
- **Real-Time Messaging**: Send and receive messages instantly with contacts.
- **Profile Management**: Update profile with a profile image.
- **Chat Status**: Online/offline and sent/seen status for messages.
- **Persistent User Sessions**: Session management using AsyncStorage.

## Tech Stack

- **React Native**: Cross-platform mobile framework.
- **Expo**: Development environment for building and testing React Native apps.
- **Axios**: For API requests to the backend.
- **AsyncStorage**: Local storage for persisting user sessions.
- **FlashList**: Efficient list rendering for chat messages and contacts.

## Installation

### Prerequisites

- Node.js installed
- Expo CLI installed globally (`npm install -g expo-cli`)
- Backend API set up (refer to backend README)

### Steps to Install

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/umeechat-frontend.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd umeechat-frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

5. Open the project on an emulator or in the **Expo Go** app on your mobile device.

## Configuration

To connect the frontend to your backend server, update the API base URL in your API service files:

```js
const apiBaseURL = "http://localhost:8080/UMee_Chat_App";
```

Ensure that the API endpoints in the code match your backend setup.

### Key Screens

1. **Sign Up Screen**: 
   - Allows users to register by providing details like name, mobile number, and profile image.
   - Form data is sent to the backend `/SignUp` endpoint.

2. **Sign In Screen**: 
   - Authenticates users based on their mobile number and password.
   - Credentials are verified by the backend `/SignIn` endpoint.

3. **Home Screen**: 
   - Displays a list of user contacts and recent conversations.
   - Fetches data from the backend via the `/LoadHomeData` endpoint.

4. **Chat Screen**: 
   - Displays chat history and allows users to send messages.
   - Communicates with the backend to load chat messages (`/LoadChat`) and send new messages (`/SendChat`).

## Project Structure

- **/assets**: Images, fonts, and other assets.
- **/components**: Reusable UI components like buttons, forms, etc.
- **/screens**: Contains all the screens of the app, such as Sign In, Sign Up, Home, and Chat screens.
- **/services**: API service files for handling network requests to the backend.
- **/utils**: Utility functions that are used across the app.

## API Endpoints

Here are the key API endpoints that the frontend communicates with:

- **Sign Up**: `POST /SignUp`
- **Sign In**: `POST /SignIn`
- **Load Home Data**: `GET /LoadHomeData?id={user_id}`
- **Load Chat**: `GET /LoadChat?logged_user_id={user_id}&other_user_id={other_user_id}`
- **Send Chat**: `GET /SendChat?logged_user_id={user_id}&other_user_id={other_user_id}&message={message}`

## Dependencies

- **React Native**: Framework for building mobile apps.
- **Expo**: Toolchain for React Native development.
- **Axios**: Library for making HTTP requests.
- **AsyncStorage**: For storing user sessions locally.
- **FlashList**: Optimized list component for rendering chat messages.
