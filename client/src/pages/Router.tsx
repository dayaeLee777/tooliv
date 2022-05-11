import React, { Suspense, lazy } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

const Login = lazy(() => import('./Login'));
const Home = lazy(() => import('./Home'));
const Channel = lazy(() => import('./Channel'));
const Meeting = lazy(() => import('./Meeting'));
const UserManagePage = lazy(() => import('./UserManagePage'));
const UserAuthPage = lazy(() => import('./UserAuthPage'));
const Join = lazy(() => import('./Join'));
const PrivateRoute = lazy(() => import('router/PrivateRoute'));
const Main = lazy(() => import('./Main'));
const EnterPriseTest = lazy(() => import('./EnterPriseTest'));
const DM = lazy(() => import('./DM'));

const AppRouter = () => {
  return (
    <>
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/enterprisetest" element={<EnterPriseTest />} />
            <Route
              path="/"
              element={<PrivateRoute outlet={<Home />} fallback={'login'} />}
            >
              <Route path="" element={<Navigate replace to="/main" />} />
              <Route path="/main" element={<Main />} />
              <Route path="/:workspaceId/:channelId" element={<Channel />} />
              <Route path="/direct/:workspaceId/:channelId" element={<DM />} />
              <Route
                path="/meeting/:workspaceId/:channelId"
                element={<Meeting />}
              />
              <Route path="/admin" element={<Navigate replace to="./auth" />} />
              <Route path="/admin/auth" element={<UserAuthPage />} />
              <Route path="/admin/manage" element={<UserManagePage />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
};

export default AppRouter;
