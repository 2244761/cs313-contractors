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
  // CatchAllNavigate,
  // NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

// Supabase Import
import supabaseClient from "./config/supabaseClient";
import { authProvider } from "./providers/auth-provider";

// Components
import { Login } from "./pages/Login";
import { StudentDashboard } from "./pages/StudentDashboard";
import StudentCalendar from "./components/StudentCalendar";
import { AdminDashboard } from "./pages/AdminDashboard";
import RoleRedirect from "./utils/role-redirect";
import { Layout } from "./components/layout/Layout";

// Pages
import { UserList, UserShow } from "./pages/users";
import { Suspended } from "./pages/Suspended";
import { ReservationCreate, ReservationList } from "./pages/reservations";
import { resources } from "./utils/resources";
import { RoomCreate, RoomList, RoomShow } from "./pages/rooms";

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
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              liveMode: "auto",
            }}
          >
            <Routes>
              <Route path="/suspended" element={<Suspended />} />
              <Route
                element={
                  <Authenticated
                    key="authenticated-inner"
                    // fallback={<CatchAllNavigate to="/login" />} // ! Temporary
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
                <Route path="/user">
                  <Route index element={<UserList />}></Route>
                  <Route path="show/:id" element={<UserShow />} />
                </Route>
                <Route path="/reservation">
                  <Route index element={<ReservationList />}></Route>
                  <Route path="create" element={<ReservationCreate />} />
                </Route>
                <Route path="/room">
                  <Route index element={<RoomList />}></Route>
                  <Route path="create" element={<RoomCreate />} />
                  <Route path="show/:id" element={<RoomShow />} />
                  <Route path="edit/:id" element={<RoomCreate />} />
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
