import React from 'react';

const Button = ({ text, type = "button" }) => {
  return (
    <button
      type={type}
      className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
    >
      {text}
    </button>
  );
};

export default Button;
