"use client";

import LoginForm from "./login-form";

// async function login(email: string, password: string): Promise<void> {
//   try {
//     const response = await fetch("/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("Lỗi khi đăng nhập:", error);
//   }
// }

export default function Page() {
  return (
    <div>
      <section className="bg-ct-blue-600 min-h-screen grid place-items-center">
        <div className="w-full">
          <h1 className="text-4xl lg:text-6xl text-center font-[600] text-ct-yellow-600 mb-4">
            Welcome Back
          </h1>
          <h2 className="text-lg text-center mb-4 text-ct-dark-200">
            Login to have access
          </h2>
          <LoginForm />
        </div>
      </section>
    </div>
  );
}
