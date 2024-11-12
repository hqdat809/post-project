export default async function Page() {
  const res = await fetch("https://api.github.com/repos/vercel/next.js", {
    cache: "no-store",
  });
  const products = await res.json();

  return <>Cart pages {products.name}</>;
}
