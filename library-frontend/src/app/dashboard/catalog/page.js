import Link from "next/link";
import Book from "@/components/Book";
import { Search } from "lucide-react";

const catalog = () => {
  return (
    <section>
      <div>
        <div>
          <h1 className="h1 gradient-text">Browse Books.</h1>
          <p className="mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
          </p>

          {/* Search bar */}
          <div className="relative hidden md:block mt-5 ">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="text-gray-900 text-sm rounded-lg block pl-10 p-2.5 focus:outline-none focus:ring-2  border-[0.5px] border-black focus:ring-orange focus:border-orange w-full"
              placeholder="Search books..."
            />
          </div>
        </div>
        <div className="flex flex-wrap mt-10 gap-6">
          <Book />
          <Book />
          <Book />
          <Book />
          <Book />
          <Book />
          <Book />
          <Book />
          <Book />
        </div>
      </div>
    </section>
  );
};

export default catalog;
