import ClientComponent from "@/component/ClientComponent";

export const dynamicParams = true;

export default function Page() {
  return (
    <div>
      <p>{new Date().toUTCString()}</p>
      <ClientComponent />
    </div>
  );
}
