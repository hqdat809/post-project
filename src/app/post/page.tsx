export default async function Page() {
  const res = await fetch("https://api.github.com/repos/vercel/next.js", {
    cache: "no-store",
  });
  const recall = await fetch("https://api.github.com/repos/vercel/next.js", {
    cache: "no-store",
  });
  const products = await res.json();
  const newProduct = await recall.json();

  return (
    <>
      Post page {products.name} - {newProduct.name}
    </>
  );
}
