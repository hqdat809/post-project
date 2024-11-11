import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  return (
    <div>
      <p>Nav Page </p>
      <Link href="/category">category</Link>
      <button type="button" onClick={() => router.push("/dashboard")}>
        Dashboard
      </button>
    </div>
  );
}
