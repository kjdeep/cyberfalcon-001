import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { AgentFeedback } from "@runablehq/website-runtime";
import { FleetShell } from "./components/fleet-shell";

const FleetOverview = lazy(() => import("./pages/fleetops").then((module) => ({ default: module.FleetOverview })));
const RobotDetail = lazy(() => import("./pages/fleetops").then((module) => ({ default: module.RobotDetail })));
const AlertsPage = lazy(() => import("./pages/fleetops").then((module) => ({ default: module.AlertsPage })));
const TicketsPage = lazy(() => import("./pages/fleetops").then((module) => ({ default: module.TicketsPage })));
const UpdatesPage = lazy(() => import("./pages/fleetops").then((module) => ({ default: module.UpdatesPage })));
const PartsPage = lazy(() => import("./pages/fleetops").then((module) => ({ default: module.PartsPage })));
const ReportsPage = lazy(() => import("./pages/fleetops").then((module) => ({ default: module.ReportsPage })));
const AuditPage = lazy(() => import("./pages/fleetops").then((module) => ({ default: module.AuditPage })));
const SettingsPage = lazy(() => import("./pages/fleetops").then((module) => ({ default: module.SettingsPage })));
const RaasPage = lazy(() => import("./pages/fleetops").then((module) => ({ default: module.RaasPage })));

function PageLoader() {
  return (
    <div className="page-loader">
      <span className="loader-mark"><img src="/falcon-logo.png" alt="" /></span>
      <span>Loading operational data…</span>
    </div>
  );
}

function RoutedApp() {
  return <FleetShell><Suspense fallback={<PageLoader />}><Switch>
    <Route path="/" component={FleetOverview} />
    <Route path="/fleet" component={FleetOverview} />
    <Route path="/robots/:id">{(params) => <RobotDetail id={params.id} />}</Route>
    <Route path="/alerts" component={AlertsPage} />
    <Route path="/tickets" component={TicketsPage} />
    <Route path="/updates" component={UpdatesPage} />
    <Route path="/parts" component={PartsPage} />
    <Route path="/reports" component={ReportsPage} />
    <Route path="/audit" component={AuditPage} />
    <Route path="/settings" component={SettingsPage} />
    <Route path="/raas" component={RaasPage} />
    <Route component={FleetOverview} />
  </Switch></Suspense></FleetShell>;
}

function App() {
  return <><RoutedApp />{import.meta.env.DEV && <AgentFeedback />}</>;
}

export default App;
