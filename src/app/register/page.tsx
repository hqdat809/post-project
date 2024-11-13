"use client";

async function signup(
  name: string,
  email: string,
  password: string,
  passwordConfirm: string
): Promise<void> {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, passwordConfirm }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
  }
}

export default function Page() {
  const handleSignUp = async () => {
    const name = "admin";
    const email = "admin2@gmail.com";
    const password = "admin@123";
    const passwordConfirm = "admin@123";
    const res = await signup(name, email, password, passwordConfirm);

    console.log(res);
  };

  return (
    <div>
      <p>Sign Up Page</p>
      <button onClick={() => handleSignUp()}>SignUp</button>
    </div>
  );
}
