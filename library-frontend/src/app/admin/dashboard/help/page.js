"use client";
import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { PlusIcon } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "What services do you offer?",
    answer:
      "We specialize in branding, including logo design, brand identity creation, web design, and packaging design. We also offer brand strategy consultations to help you stand out in your industry.",
  },
  {
    id: 2,
    question: "What is your process for branding projects?",
    answer:
      "Our process involves discovery, strategy, design, and delivery. We begin with an in-depth consultation to understand your brand, followed by mood board creation, initial design concepts, and revisions. The final step is delivering all assets in various formats.",
  },
  {
    id: 3,
    question: "How long does a typical branding project take?",
    answer:
      "Most branding projects take 4–6 weeks from start to finish, depending on the complexity of the work and the responsiveness of feedback.",
  },
  {
    id: 4,
    question: "Do you offer custom packages?",
    answer:
      "Yes, we understand that every business is unique. We can create custom packages tailored to your specific needs and goals.",
  },
  {
    id: 5,
    question: "Can I request a specific style for my branding?",
    answer:
      "Absolutely! We love working with clients to achieve their vision. During the discovery phase, we’ll gather inspiration and references to ensure the final design matches your desired style.",
  },
  {
    id: 6,
    question: "Do you offer website design as part of your services?",
    answer:
      "Yes, we offer website design as part of our branding packages. Whether you need a custom WordPress site or a simple portfolio page, we can help.",
  },
  {
    id: 7,
    question: "What industries do you work with?",
    answer:
      "We work with a variety of industries, including lifestyle brands, startups, wellness businesses, creatives, and small business owners. We're open to collaborating with businesses from other industries as well.",
  },
  {
    id: 8,
    question: "How much do your services cost?",
    answer:
      "Our pricing depends on the scope of the project. Branding packages start at $2,500, but we recommend scheduling a consultation so we can provide a custom quote tailored to your needs.",
  },
];

const HelpPage = () => {
  const [openAcc, setOpenAcc] = useState(null);
  const handleToggle = (id) => {
    setOpenAcc((prev) => (prev === id ? null : id));
  };

  return (
    <section>
      <div>
        <h1 className="h1 gradient-text">Help</h1>
        <p className="mt-2">Get answers to any questions you might have.</p>
      </div>

      <div className="grid gap-4 mt-6 md:mt-12">
        <LayoutGroup>
          <div>
            {questions.map(({ question, answer, id }, index) => (
              <Accordion
                key={id}
                id={id}
                question={question}
                answer={answer}
                isOpen={openAcc === id}
                onClick={handleToggle}
              />
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
};

export default HelpPage;

function Accordion({ question, answer, isOpen, onClick, id }) {
  return (
    <motion.div
      className="py-4 rounded-lg mb-4 overflow-hidden border-b"
      layout
      transition={{ ease: "backOut" }}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">{question}</h3>
        <motion.button
          className=" rounded-[50%] size-10 cursor-pointer text-lg font-medium"
          onClick={() => onClick(id)}
        >
          <PlusIcon />
        </motion.button>
      </div>
      {isOpen && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {answer}
        </motion.p>
      )}
    </motion.div>
  );
}
