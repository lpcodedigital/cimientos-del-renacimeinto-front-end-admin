import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayout,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { ForgotPassword } from "./pages/forgotPassword";
import { Register } from "./pages/register";
import { authProvider } from "./providers/auth";
import { dataProvider } from "./providers/data";
import { Typography } from "@mui/material";
import { ObraList } from "./pages/obras/list";
import { Title } from "./components/Title";
import { ObraShow } from "./pages/obras/show";
import { ObraCreate } from "./pages/obras/create";
import { ObraEdit } from "./pages/obras/edit";
import { DashboardPage } from "./pages/dashboard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { UserList } from "./pages/users/list";
import PeopleIcon from "@mui/icons-material/People";
import { UserShow } from "./pages/users/show";
import { UserCreate } from "./pages/users/create";

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "inicio",
                    list: "/", // Ruta raíz
                    meta: {
                      label: "Dashboard",
                      icon: <DashboardIcon />,
                      //hide: false,
                      //dashboard: true,
                      hide: true, // <--- Esto oculta el recurso del menú
                    },
                  },
                  {
                    name: "obra",
                    list: "/obras",
                    show: "/obras/show/:id",
                    create: "/obras/create",
                    edit: "/obras/edit/:id",
                    meta: {
                      label: "Obras",
                      icon: <AccountTreeIcon />,
                      //canDelete: true
                    },
                  },
                  {
                    name: "user",
                    list: "/users",
                    show: "/users/show/:id",
                    create: "/users/create",
                    meta: {
                      label: "Usuarios",
                      icon: <PeopleIcon/>,
                    },
                  },
                  {
                    name: "role",
                    meta: {
                      label: "Roles",
                    }
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  //projectId: "BxY4st-O3V8VR-CgM5O6",
                }}
              >
                <Routes>
                  {/* Rutas Protegidas */}
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout
                          Header={Header}

                          // Pasamos un componente de título que no contiene enlaces, para evitar el error de "<a> inside <a>"
                          Title={Title}
                        >
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    {/* 1. RUTA INICIAL: El index ahora renderiza DashboardPage directamente */}
                    <Route
                      index
                      element={<DashboardPage />}
                    />
                    <Route path="/obras">
                      <Route index element={<ObraList />} />
                      <Route path="/obras/show/:id" element={<ObraShow />} />
                      <Route path="create" element={<ObraCreate />} />
                      <Route path="edit/:id" element={<ObraEdit />} />
                    </Route>

                    <Route path="/users">
                      <Route index element={<UserList />} />
                      <Route path="show/:id" element={<UserShow />} />
                      <Route path="create" element={<UserCreate />} />
                    </Route>

                    <Route path="*" element={<ErrorComponent />} />

                  </Route>


                  {/* Rutas Públicas */}
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={
                      <AuthPage
                        type="login"
                        title={
                          // Al definir el título como un simple string o un Box sin links,
                          // evitas el error de "<a> inside <a>"
                          <Typography variant="h5" fontWeight={700}>
                            SIB ADMIN
                          </Typography>
                        }
                      />
                    } />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
