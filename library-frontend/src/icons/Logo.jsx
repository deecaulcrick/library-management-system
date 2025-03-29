// import React, { useState, useEffect } from "react";

export default function Logo({ className }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const angle = (clientX + clientY) % 360;
      setRotation(angle);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <svg
      width="35"
      height="39"
      viewBox="0 0 35 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="0.269001" width="16.8126" height="38.6017" fill="#DBB8FF" />
      <circle cx="6.05254" cy="4.16957" r="0.672503" fill="white" />
      <circle
        cx="6.18704"
        cy="4.1695"
        r="0.336252"
        fill="black"
        transform={`rotate(${rotation} 6.18704 4.1695)`}
      />
      <rect
        x="8.4063"
        y="3.83325"
        width="1.00875"
        height="4.43852"
        fill="black"
      />
      <circle cx="11.8361" cy="4.16957" r="0.672503" fill="white" />
      <circle
        cx="11.9706"
        cy="4.1695"
        r="0.336252"
        fill="black"
        transform={`rotate(${rotation} 11.9706 4.1695)`}
      />
      <rect
        x="12.5086"
        y="8.27185"
        width="9.14605"
        height="30.3299"
        fill="#222222"
      />
      <circle cx="18.4266" cy="11.6343" r="0.672503" fill="white" />
      <circle
        cx="18.5611"
        cy="11.6343"
        r="0.336252"
        fill="black"
        transform={`rotate(${rotation} 18.5611 11.6343)`}
      />
      <circle cx="21.4529" cy="11.6343" r="0.672503" fill="white" />
      <circle
        cx="21.5874"
        cy="11.6343"
        r="0.336252"
        fill="black"
        transform={`rotate(${rotation} 21.5874 11.6343)`}
      />
      <path
        d="M19.0991 21.1839C19.0991 17.8412 21.8089 15.1313 25.1516 15.1313C28.4943 15.1313 31.2042 17.8412 31.2042 21.1839V38.6017H19.0991V21.1839Z"
        fill="#F2BB05"
      />
      <circle
        cx="23.3695"
        cy="20.2087"
        r="0.504378"
        fill="black"
        transform={`rotate(${rotation} 23.3695 20.2087)`}
      />
      <rect
        x="25.2189"
        y="22.3944"
        width="9.68405"
        height="0.672503"
        fill="black"
      />
      <path
        d="M0 37.4584C0 32.7414 3.82384 28.9176 8.54079 28.9176C13.2577 28.9176 17.0816 32.7414 17.0816 37.4584V38.6017H0V37.4584Z"
        fill="#FF5B2F"
      />
      <circle
        cx="7.80104"
        cy="33.0872"
        r="0.672503"
        fill="black"
        transform={`rotate(${rotation} 7.80104 33.0872)`}
      />
      <circle
        cx="11.1636"
        cy="33.0872"
        r="0.672503"
        fill="black"
        transform={`rotate(${rotation} 11.1636 33.0872)`}
      />
      <path
        d="M8.67529 34.4321H10.4911C10.4911 34.915 10.0996 35.3064 9.6168 35.3064H9.54955C9.06671 35.3064 8.67529 34.915 8.67529 34.4321Z"
        fill="black"
      />
    </svg>
  );
}
