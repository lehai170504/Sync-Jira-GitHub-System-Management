import { Button } from "@/components/ui/button";
export default function HomePage() {
  return (
    <main>
      <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
      <p className="text-green-300">
        This is the main landing page of the application.
      </p>
      <Button className="mt-4">Get Started</Button>
    </main>
  );
}
