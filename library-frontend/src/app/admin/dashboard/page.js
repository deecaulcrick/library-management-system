import Book from "@/components/Book";
import RecentActivity from "@/components/RecentActivity";
import Link from "next/link";

const Page = () => {
  return (
    <section className="">
      <div>
        <div className="">
          <h1 className="h1 gradient-text">Dashboard</h1>
          <div className="">
            <RecentActivity />
          </div>
        </div>
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="h2">Borrowed books</h2>
            <Link
              href="/dashboard/loans"
              className="font-medium text-[#FF5B2F] underline text-sm"
            >
              See all
            </Link>
          </div>
          <div className="flex gap-4 mt-4 overflow-x-scroll">
            <Book />
            <Book />
            <Book />
            <Book />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
