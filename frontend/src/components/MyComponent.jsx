import React, { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef();

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div className="text-center mt-5">
      <input
        ref={inputRef}
        type="text"
        placeholder="Type something..."
        className="border p-2 rounded"
      />
      <br />
      <button
        onClick={focusInput}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Focus Input
      </button>
    </div>
  );
}

export default MyComponent;
