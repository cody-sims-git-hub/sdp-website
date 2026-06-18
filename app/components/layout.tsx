import { Outlet } from "react-router";
import { VideoBackground } from "~/components/video-background";
import { SiteHeader } from "~/components/site-header";
import { SiteFooter } from "~/components/site-footer";

export default function SiteLayout() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <VideoBackground />
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
