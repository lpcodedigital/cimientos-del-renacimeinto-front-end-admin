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
import { UserEdit } from "./pages/users/edit";
import { UpdatePassword } from "./pages/updatePassword/UpdatePassword";
import { accessControlProvider } from "./providers/accessControl";
import { Verify2FA } from "./pages/login/Verify2FA";
import { CursoList } from "./pages/curso/list";
import SchoolIcon from "@mui/icons-material/School";
import { CursoCreate } from "./pages/curso/create";
import { CursoEdit } from "./pages/curso/edit";
import { CursoShow } from "./pages/curso/show";
import { i18nProvider } from "./langs/es";

function App() {

  return (
    <BrowserRouter>
      
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                i18nProvider={i18nProvider}
                accessControlProvider={accessControlProvider}
                dataProvider={dataProvider}
                authProvider={authProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
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
                    edit: "/users/edit/:id",
                    meta: {
                      label: "Usuarios",
                      icon: <PeopleIcon />,
                    },
                  },
                  {
                    name: "curso",
                    list: "/cursos",
                    show: "/cursos/show/:id",
                    create: "/cursos/create",
                    edit: "/cursos/edit/:id",
                    meta: {
                      label: "Cursos",
                      icon: <SchoolIcon />,
                    },
                  },
                  // Recurso "role" para cargar los roles en el catálogo de userCreate y userEdit
                  {
                    name: "role",
                    meta: {
                      label: "Roles",
                    }
                  },
                  {
                    name: "municipio",
                    meta: {
                      lanel: "Municipios",
                      hide: true, // <--- Esto oculta el recurso del menú
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
                  {/* 1. Ruta de Verificación (Pública Absoluta) */}
                  <Route path="/verify-2fa" element={<Verify2FA />} />
                  
                  {/* Rutas Protegidas */}
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout Header={Header} Title={Title} >
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    {/* 1. RUTA INICIAL: El index ahora renderiza DashboardPage directamente */}
                    <Route index element={<DashboardPage />} />
                    <Route path="/obras">
                      <Route index element={<ObraList />} />
                      <Route path="/obras/show/:id" element={<ObraShow />} />
                      <Route path="create" element={<ObraCreate />} />
                      <Route path="edit/:id" element={<ObraEdit />} />
                    </Route>
                    <Route path="/cursos">
                      <Route index element={<CursoList />} />
                      <Route path="/cursos/show/:id" element={<CursoShow />} />
                      <Route path="create" element={<CursoCreate />} />
                      <Route path="edit/:id" element={<CursoEdit />} />
                    </Route>
                    <Route path="/users">
                      <Route index element={<UserList />} />
                      <Route path="show/:id" element={<UserShow />} />
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserEdit />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>

                  {/* Rutas Públicas */}
                  <Route
                    path="/update-password"
                    element={
                      <Authenticated key="update-password" fallback={<CatchAllNavigate to="/login" />}>
                        <UpdatePassword />
                      </Authenticated>
                    }
                  />

                  <Route
                    element={
                      <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route
                      path="/login"
                      element={
                        <AuthPage
                          type="login"
                          registerLink={false}
                          //forgotPasswordLink={false}
                          rememberMe={false}
                          title={
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                              <img src="/logo.png" alt="Logo CR" style={{ width: '60px' }} />
                              <Typography variant="h5" fontWeight={700} color="primary">
                                Cimientos Del Renacimiento
                              </Typography>
                            </div>
                          }
                          // Opcional: Si quieres quitar el "Powered by refine" del fondo
                          wrapperProps={{
                            style: {
                              background: "#f0f2f5",
                            }
                          }}
                        />
                      }
                    />

                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler
                  handler={(options) => {
                    // 1. Si estamos en una página de Auth (como el Login)
                    if (window.location.pathname === "/login") {
                      return "Iniciar Sesión | CR";
                    }

                    // 2. Intentamos obtener el nombre del recurso traducido o el label
                    const resourceName = options.resource?.meta?.label || options.resource?.name;

                    // 3. Si hay una acción específica (edit, create, show)
                    const action = options.action ? ` - ${options.action}` : "";

                    if (!resourceName) {
                      return "CR - Panel Administrativo";
                    }

                    return `${resourceName}${action} | CR`;
                  }}
                />
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
