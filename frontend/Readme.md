# Water Quality Monitor Frontend - React Setup Guide

This guide is a beginner's guide to set up a React frontend server for the Water Quality Monitor project. We'll use Tailwind CSS for styling. Follow these steps carefully!

## Prerequisites
Before starting, make sure you have these installed on your computer:
- **Node.js**: Download from [nodejs.org](https://nodejs.org/). This includes npm (Node Package Manager).
- **Git**: For cloning repositories if needed.
- A code editor like VS Code.

Check if Node.js is installed by running `node -v` and `npm -v` in your terminal.

## Step 1: Create a New React App
1. Open your terminal and navigate to the frontend directory:
   ```
   cd water-quality-monitor/water-quality-monitor/frontend
   ```
2. Create a new React app using Create React App:
   ```
   npx create-react-app .
   ```
   - This sets up a basic React project in the current directory.
   - If prompted, confirm to overwrite the empty readme.md (we'll replace it).

## Step 2: Install Crucial Dependencies
Install the following packages using npm. Each one is explained below.

Run these commands in your terminal (still in the frontend directory):

```
npm install tailwindcss postcss autoprefixer
npm install react-router-dom
npm install axios
npm install @reduxjs/toolkit react-redux  # Optional for advanced state management
```

### Crucial Dependencies and Their Usages
- **React**: The core library for building user interfaces. It lets you create reusable components.
- **Tailwind CSS**: A utility-first CSS framework for styling. Instead of writing custom CSS, you use classes like `bg-blue-500` for backgrounds.
  - **postcss** and **autoprefixer**: Tools that help Tailwind work with your CSS.
- **React Router DOM**: For handling routing (navigating between pages) in your app. Use it to create multi-page apps without reloading.
- **Axios**: A library for making HTTP requests to fetch data from APIs (like your backend). Easier than built-in fetch.
- **Redux Toolkit** and **React Redux**: For managing app state across components. Useful for complex apps; start with React's built-in hooks if simple.

## Step 3: Configure Tailwind CSS
1. Initialize Tailwind:
   ```
   npx tailwindcss init -p
   ```
   - This creates `tailwind.config.js` and `postcss.config.js`.

2. Edit `tailwind.config.js` to include your source files:
   ```javascript
   module.exports = {
     content: ["./src/**/*.{js,jsx,ts,tsx}"],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. Replace the content of `src/index.css` with:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## Step 4: Basic Project Structure
Your `src` folder should look like this:
- `App.js`: Main app component.
- `index.js`: Entry point.
- `components/`: Folder for reusable components (create this).
- `pages/`: Folder for different pages (create this).
- `utils/`: Folder for helpers like API calls (create this).

## Step 5: Reusable Components
Components are like building blocks. Create them in `src/components/`.

Example: Create `Button.js`:
```jsx
import React from 'react';

const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {text}
    </button>
  );
};

export default Button;
```
- Use Tailwind classes for styling (e.g., `bg-blue-500` for blue background).
- Pass props like `text` and `onClick` to make it reusable.

## Step 6: Styling with Tailwind CSS
- Add classes directly in JSX: `<div className="flex justify-center items-center h-screen bg-gray-100">`.
- Common classes: `text-center` (center text), `p-4` (padding), `m-2` (margin).
- For responsive design: `md:text-lg` (large text on medium screens).
- Customize in `tailwind.config.js` if needed.

## Step 7: State Management
Use React's built-in hooks for simple state.

Example in `App.js`:
```jsx
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export default App;
```
- `useState` manages local state.
- For global state, use Redux: Wrap your app in a Provider and use `useSelector`/`useDispatch`.

## Step 8: Routing
Use React Router for navigation.

Example in `App.js`:
```jsx
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
```
- `BrowserRouter` wraps your app.
- `Routes` and `Route` define pages.
- `Link` for navigation without page reload.

## Step 9: DOM Manipulation
React handles DOM updates automatically. Use refs for direct access.

Example:
```jsx
import React, { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef();

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```
- Avoid direct DOM manipulation; let React manage it.

## Step 10: Fetching API Endpoint Data and Populating Components
Use Axios to fetch data from your backend (e.g., water quality data).

Example in a component:
```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WaterData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/water-data')  // Replace with your backend URL
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      {data.map(item => (
        <div key={item.id} className="p-4 border">
          <p>pH: {item.ph}</p>
          <p>Temperature: {item.temp}</p>
        </div>
      ))}
    </div>
  );
}

export default WaterData;
```
- `useEffect` runs on component mount to fetch data.
- Populate components by mapping over the data array.
- Handle loading states and errors for better UX.

## Step 11: Run the Server
1. Start the development server:
   ```
   npm start
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.
3. Your React app with Tailwind CSS is now running!

## Troubleshooting
- If styles don't apply, ensure Tailwind is configured correctly.
- For API errors, check your backend is running and CORS is enabled.
- Clear npm cache: `npm cache clean --force` if issues persist.

Happy coding! If stuck, check React and Tailwind docs.
