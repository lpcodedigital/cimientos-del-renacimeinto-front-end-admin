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
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { authProvider } from "./providers/auth";
import { dataProvider } from "./providers/data";
import { Typography } from "@mui/material";
import { ObraList } from "./pages/obras/list";
import { Title } from "./components/Title";
import { ObraShow } from "./pages/obras/show";
import { ObraCreate } from "./pages/obras/create";

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
                  // {
                  //   name: "blog_posts",
                  //   list: "/blog-posts",
                  //   create: "/blog-posts/create",
                  //   edit: "/blog-posts/edit/:id",
                  //   show: "/blog-posts/show/:id",
                  //   meta: {
                  //     canDelete: true,
                  //   },
                  // },
                  // {
                  //   name: "categories",
                  //   list: "/categories",
                  //   create: "/categories/create",
                  //   edit: "/categories/edit/:id",
                  //   show: "/categories/show/:id",
                  //   meta: {
                  //     canDelete: true,
                  //   },
                  // },
                  {
                    name: "obra",
                    list: "/obras",
                    show: "/obras/show/:id",
                    create: "/obras/create",
                    meta: {
                      label: "Obras",
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "BxY4st-O3V8VR-CgM5O6",
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
                    <Route
                      index
                      //element={<NavigateToResource resource="blog_posts" />}
                      element={<NavigateToResource resource="obra" />}
                    />
                    
                    {/* <Route path="/blog-posts">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route>
                    <Route path="/categories">
                      <Route index element={<CategoryList />} />
                      <Route path="create" element={<CategoryCreate />} />
                      <Route path="edit/:id" element={<CategoryEdit />} />
                      <Route path="show/:id" element={<CategoryShow />} />
                    </Route> */}
                    <Route path="/obras">
                      <Route index element={<ObraList />} />
                      <Route path="/obras/show/:id" element={<ObraShow />} />
                      <Route path="create" element={<ObraCreate />} />
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
