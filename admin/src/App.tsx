import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { toast, Toaster } from "sonner";
import { Button } from "./components/ui/button";

export function App() {
  return (
    <>
      <div className="">
        <Sidebar />
        <Button onClick={() => { toast.error("Hello") }}>Click</Button>
        <div>
          <Header />
          <main>
            <Outlet />
          </main>
        </div>
        <Toaster />
      </div>
    </>
  );
}