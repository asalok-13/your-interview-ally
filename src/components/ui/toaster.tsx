import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "bg-card border-border",
          title: "text-foreground",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}
