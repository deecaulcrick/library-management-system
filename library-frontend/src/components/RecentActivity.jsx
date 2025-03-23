import { BookOpen } from "lucide-react";

const RecentActivity = () => {
  return (
    <section className="mt-5">
      <div>
        <h3 className="h3 text-sm">Recent Activity</h3>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Activity color="#DBB8FF" />
        <Activity color="#FF5B2F" />
        <Activity color="#FF9F05" />
        <Activity color="#3939FF" />
      </div>
    </section>
  );
};

export default RecentActivity;

const Activity = ({ color, number = 3, text = "Books borrowed" }) => {
  return (
    <div
      className="border-[0.5px] border-black rounded-[20px] p-7 hover:shadow-lg transition duration-300 ease-in-out

    "
    >
      <div className="flex justify-between items-start">
        <div className="h1 gradient-text">{number}</div>
        <BookOpen size={20} strokeWidth={1.5} />
      </div>
      <div className="font-semibold gradient-text text-xl tracking-tighter">
        {text}
      </div>
    </div>
  );
};
