import LogoText from "@/icons/LogoText";
import Image from "next/image";
import Link from "next/link";

const images = [
  {
    src: "/assets/bookimg.png",
    rotate: "rotate(-14deg)",
  },
  {
    src: "/assets/bookimg.png",
    rotate: "rotate(-12deg)",
  },
  {
    src: "/assets/bookimg.png",
    rotate: "rotate(-8deg)",
  },
  {
    src: "/assets/bookimg.png",
    rotate: "rotate(0deg)",
  },
  {
    src: "/assets/bookimg.png",
    rotate: "rotate(8deg)",
  },
  {
    src: "/assets/bookimg.png",
    rotate: "rotate(12deg)",
  },
  {
    src: "/assets/bookimg.png",
    rotate: "rotate(14deg)",
  },
];

export default function Home() {
  return (
    <section className="h-screen w-full">
      <div>
        <header className="w-full flex justify-between items-center p-4">
          <LogoText />
          <nav className="flex items-center gap-4">
            <Link href="/signup">
              <button className="button">Sign up</button>
            </Link>
            <Link href="/login">
              <button className="button bg-transparent border text-black border-black">
                Log in
              </button>
            </Link>
          </nav>
        </header>
        <main className="p-12 h-screen flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center ">
            <h1 className="h1 text-5xl lg:text-8xl text-center gradient-text leading-none">
              Unlock Knowledge, <br />
              Code the Future.
            </h1>
            <div className="flex justify-center items-center mt-15 ">
              {images.map((image) => (
                <Image
                  src={image.src}
                  width={300}
                  height={300}
                  className="w-20 h-20 md:w-45 md:h-60 rounded-md object-cover object-top -mx-6 shadow-md hover:-translate-y-[10px] transition duration-500 ease-in-out"
                  style={{ transform: image.rotate }}
                />
              ))}
            </div>
            <p className="md:w-[50%] text-center my-15">
              Your ultimate hub for computer science books, research papers, and
              coding resources—designed to fuel innovation and empower the next
              generation of tech leaders.
            </p>
            <button className="button">Explore the library</button>
          </div>
        </main>
        <footer></footer>
      </div>
    </section>
  );
}
