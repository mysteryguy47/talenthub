import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PaperCreate from "./pages/PaperCreate";
import Mental from "./pages/Mental";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AbacusCourse from "./pages/AbacusCourse";
import VedicMathsCourse from "./pages/VedicMathsCourse";
import HandwritingCourse from "./pages/HandwritingCourse";
import STEMCourse from "./pages/STEMCourse";
import { ReactNode } from "react";
// import Settings from "./pages/Settings";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  
  console.log("🟡 [PROTECTED] Route check - loading:", loading, "authenticated:", isAuthenticated, "user:", user?.email);
  
  if (loading) {
    console.log("🟡 [PROTECTED] Still loading, showing loading screen");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("🟡 [PROTECTED] Not authenticated, showing login");
    return <Login />;
  }
  
  console.log("✅ [PROTECTED] Authenticated, showing protected content");
  return <>{children}</>;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={Home} />
          <Route path="/create/junior" component={PaperCreate} />
          <Route path="/create/basic" component={PaperCreate} />
          <Route path="/create/advanced" component={PaperCreate} />
          <Route path="/create" component={PaperCreate} />
          <Route path="/vedic-maths/level-1" component={PaperCreate} />
          <Route path="/vedic-maths/level-2" component={PaperCreate} />
          <Route path="/vedic-maths/level-3" component={PaperCreate} />
          <Route path="/vedic-maths/level-4" component={PaperCreate} />
          <Route path="/mental">
            <ProtectedRoute>
              <Mental />
            </ProtectedRoute>
          </Route>
          <Route path="/dashboard">
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/admin">
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/courses/abacus" component={AbacusCourse} />
          <Route path="/courses/vedic-maths" component={VedicMathsCourse} />
          <Route path="/courses/handwriting" component={HandwritingCourse} />
          <Route path="/courses/stem" component={STEMCourse} />
          {/* <Route path="/settings">
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          </Route> */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

