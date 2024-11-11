import type { InferGetStaticPropsType, GetStaticProps } from "next";

type Repo = {
  name: string;
  stargazers_count: number;
};

export const getStaticProps = (async () => {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const repo = await res.json();
  console.log(repo);
  return { props: { repo } };
}) satisfies GetStaticProps<{
  repo: Repo;
}>;

export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <div>Post Page {repo.stargazers_count}</div>;
}
