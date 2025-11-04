// React Router Imports
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

// Refine Imports
import { Authenticated, Refine, ErrorComponent } from "@refinedev/core";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import routerProvider, {
  CatchAllNavigate,
  // NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

// Supabase Import
import supabaseClient from "./config/supabaseClient";
import { authProvider } from "./providers/auth-provider";

// Components
import { Login } from "./pages/Login";
import { StudentDashboard } from "./components/StudentDashboard";
import StudentCalendar from "./components/StudentCalendar"
import { AdminDashboard } from "./components/AdminDashboard";
import RoleRedirect from "./RoleRedirect";
import { Layout } from "./components/layout";

// Pages
import { UserList } from "./pages/users";
import { ReservationList } from "./pages/reservations";
import { SuspendedPage } from "./pages/Suspended";

function App() {
  return (
    <>
      <BrowserRouter>
        <RefineKbarProvider>
          <Refine
            dataProvider={dataProvider(supabaseClient)}
            liveProvider={liveProvider(supabaseClient)}
            routerProvider={routerProvider}
            authProvider={authProvider}
            resources={[
              { name: "calendar", list: "/calendar", },
              { name: "reservations", list: "/reservations" },
              { name: "history", list: "/history" },
              { name: "rooms", list: "/rooms" },
              { name: "users", list: "/users" },
              { name: "announcement", list: "/announcement" },
              { name: "inbox", list: "/inbox" },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-inner"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                <Route index element={<RoleRedirect />} />
                <Route
                  path="/student-dashboard"
                  element={<StudentDashboard />}
                />
                  <Route path="/calendar" element={<StudentCalendar />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/users">
                  <Route index element={<UserList />}></Route>
                </Route>
                <Route path="/reservations">
                  <Route index element={<ReservationList />}></Route>
                </Route>
                <Route path="*" element={<ErrorComponent />} />
              </Route>
              <Route
                element={
                  <Authenticated
                    key="authenticated-outer"
                    fallback={<Outlet />}
                  >
                    <Navigate to="/" replace />
                  </Authenticated>
                }
              >
                <Route path="/suspended" element={<SuspendedPage />} />
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
          </Refine>
        </RefineKbarProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
