import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import { Provider } from "./components/provider";
import { AgentFeedback } from "@runablehq/website-runtime";

const Home = lazy(() => import("./pages/index"));
const Services = lazy(() => import("./pages/services"));
const About = lazy(() => import("./pages/about"));
const Blog = lazy(() => import("./pages/blog"));
const Contact = lazy(() => import("./pages/contact"));
const Admin = lazy(() => import("./pages/admin"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neon-red border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <Provider>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/about" component={About} />
          <Route path="/blog" component={Blog} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={Admin} />
        </Switch>
      </Suspense>
      {import.meta.env.DEV && <AgentFeedback />}

    </Provider>
  );
}

export default App;
