import Image from "next/image";
import React from "react";

const Book = ({ image, title, author }) => {
  return (
    <div className="w-52 flex-none">
      <img src="/assets/bookimg.png" className="shadow-xl mb-4" />
      <h3 className="tracking-tight font-medium text-md">
        Principles of Web Design
      </h3>
      <p className="tracking-tight text-zinc-600 text-xs">
        <i> by Author name</i>
      </p>
    </div>
  );
};

export default Book;
