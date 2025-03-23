import LoginForm from "@/components/auth/LoginForm";

const login = () => {
  return (
    <section className="h-screen p-6 flex items-center justify-center purple">
      <div className="w-[40%] bg-white rounded-4xl p-16 flex items-center justify-center">
        <LoginForm />
      </div>
    </section>
  );
};

export default login;
