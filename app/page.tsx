import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1>Welcome to the Devide App</h1>
      <Button >
        Get Started
      </Button>
    </div>
  );
}
