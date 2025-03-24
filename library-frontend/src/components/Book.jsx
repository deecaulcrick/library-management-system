const Book = ({ image, title, author, id }) => {
  return (
    <div className="w-52 flex-none">
      <img
        src={image || "/assets/bookimg.png"}
        className="shadow-xl mb-4"
        
      />
      <h3 className="tracking-tight font-medium text-md">
        {title || "Principles of Web Design"}
      </h3>
      <p className="tracking-tight text-zinc-600 text-xs">
        <i> by {author || "Author name"}</i>
      </p>
    </div>
  );
};

export default Book;
