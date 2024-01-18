import type { MetaFunction } from "@remix-run/node";
import CarbonContentPage from "~/components/CarbonContentPage";

export const meta: MetaFunction = () => {
  return [
    { title: "Летовед" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <CarbonContentPage>
      <h1>Трагедия семьи Романовых</h1>
    </CarbonContentPage>    
  );
}
