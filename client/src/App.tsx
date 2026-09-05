import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

/**
 * Quiet Casework: keep the app shell quiet and editorial so the document workspace
 * can carry the hierarchy. This file owns routing only; page behavior lives in Home.
 */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/document" component={Home} />
      <Route path="/situation" component={Home} />
      <Route path="/about" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
