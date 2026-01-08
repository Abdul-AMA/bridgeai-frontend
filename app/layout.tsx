import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";
import { geistSans } from "@/fonts"; // Ensure fonts are applied at the root if needed

export const metadata = {
  title: "BridgeAI",
  description: "AI-Powered Requirements Analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`h-screen flex flex-col ${geistSans.className}`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
