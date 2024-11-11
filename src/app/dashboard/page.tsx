import ClientComponent from "@/component/ClientComponent";
import { unstable_noStore } from "next/cache";

export const dynamicParams = true;

export default function Page() {
  unstable_noStore();

  return (
    <div>
      <p>{new Date().toUTCString()}</p>
      <ClientComponent />
    </div>
  );
}
