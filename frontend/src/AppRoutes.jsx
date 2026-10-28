import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoutes from "./layout/ProtectedRoutes";
import SharedLayout from "./layout/SharedLayout";

const Login = lazy(() => import("./features/auth/Login"));
const Register = lazy(() => import("./features/auth/Register"));
const Home = lazy(() => import("./pages/home/Home"));

const UserProfile = lazy(() => import("./pages/user/UserProfile"));
const UserList = lazy(() => import("./pages/user/UserList"));
const Board = lazy(() => import("./pages/ticket-management/sprint/Board"));
const Sprint = lazy(() => import("./pages/ticket-management/sprint/Sprint"));
const TicketDetail = lazy(() => import("./pages/ticket-management/TicketDetail"));

const PageNotFound = lazy(() => import("./components/error/PageNotFound"));

const PageLoader = () => (
    <div className="page-loader">
        <p>Loading...</p>
    </div>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoutes>
                <SharedLayout />
            </ProtectedRoutes>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: '/profile/:id',
                element: <UserProfile />,
            },
            {
                path: '/team',
                element: <UserList />,
            },
            {
                path: '/board/:project',
                element: <Board />,
            },
            {
                path: '/sprints',
                element: <Sprint />,
            },
            {
                path: '/ticket/:ticketId',
                element: <TicketDetail />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "*",
        element: <PageNotFound />,
    },
]);

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <RouterProvider router={router} />
        </Suspense>
    );
};

export default AppRoutes;