import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-dvh mx-auto flex items-center justify-center">
      <SignIn />;
    </div>
  );
}
