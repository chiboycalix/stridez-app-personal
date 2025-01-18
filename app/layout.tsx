import "./globals.css";
import MainLayout from "@/components/layouts/MainLayout";
import { AuthProvider } from "@/context/AuthContext";
import { PostProvider } from "@/context/PostContext";
import { VideoPlaybackProvider } from "@/context/VideoPlaybackContext";
import { WebSocketProvider } from "@/context/WebSocket";
import { Manrope } from "next/font/google";
import { VideoConferencingProvider } from "@/context/VideoConferencingContext";
import { ToastProvider } from "@/context/ToastContext";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <AuthProvider>
          <WebSocketProvider>
            <MainLayout>
              <ToastProvider>
                <PostProvider>
                  <VideoConferencingProvider>
                    <VideoPlaybackProvider>{children}</VideoPlaybackProvider>
                  </VideoConferencingProvider>
                </PostProvider>
              </ToastProvider>
            </MainLayout>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
