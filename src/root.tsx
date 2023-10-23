// @refresh reload
import { Suspense } from "solid-js";
import {
  useLocation,
  Body,
  ErrorBoundary,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  useNavigate,
  Link,
} from "solid-start";
import "./root.css";
import { Route } from "@solidjs/router";
import Board from "./routes/board";
import Plan from "./routes/plan";
import Home from "./routes/index";
import Profile from "./routes/profile";
import Login from "./routes/login";
import Register from "./routes/register";
import Settings from "./routes/settings";
import Progress from "./routes/progress";
import { MonitorIcon } from "./components/ui/icons/MonitorIcon";
import { DashboardIcon } from "./components/ui/icons/DashboardIcon";
import { UserGroupIcon } from "./components/ui/icons/UserGroupIcon";
import { ToolIcon } from "./components/ui/icons/ToolIcon";

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();

  const active = (path: string) =>
    path == location.pathname ? "text-primary" : "";

  return (
    <Html lang="de" class="overflow-x-hidden">
      <Head>
        <Title>SaarClimb</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="manifest" href="/manifest.webmanifest" />
        <script id="vite-plugin-pwa:register-sw" src="/registerSW.js"></script>
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <nav class="bg-white fixed bottom-0">
              <div class="grid grid-cols-4 w-screen gap-5 px-1 pt-1">
                <button
                  class={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                    "/"
                  )}`}
                  onClick={() => navigate("/")}
                >
                  <DashboardIcon />
                  <p class="text-sm">Dashboard</p>
                </button>
                <button
                  class={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                    "/plan"
                  )}`}
                  onClick={() => navigate("/plan")}
                >
                  <ToolIcon />
                  <p class="text-sm">Planer</p>
                </button>
                <button
                  class={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                    "/progress"
                  )}`}
                  onClick={() => navigate("/progress")}
                >
                  <UserGroupIcon />
                  <p class="text-sm">Fortschritt</p>
                </button>
                <button
                  class={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                    "/board"
                  )}`}
                  onClick={() => navigate("/board")}
                >
                  <MonitorIcon />
                  <p class="text-sm">Ranking</p>
                </button>
              </div>
            </nav>

            <Routes>
              {/* <FileRoutes /> */}
              <Route path="/" component={Home} />
              <Route path="/plan" component={Plan} />
              <Route path="/board" component={Board} />
              <Route path="/profile" component={Profile} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/settings" component={Settings} />
              <Route path="/progress" component={Progress} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
