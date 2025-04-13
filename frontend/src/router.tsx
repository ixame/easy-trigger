import { FC } from 'react';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import ErrorBoundary from './pages/error/index.tsx';
import Layout from './app/layout.tsx';

export const routes: RouteObject[] = [

  {
    path: '/',
    element: <Layout children={undefined} />,
    errorElement: (
      <Layout>
        <ErrorBoundary />
      </Layout>
    ),
    
    children: [
      // {
      //   path: '/login',
      //   lazy: async () => ({
      //     Component: (await import('./pages/auth/login')).default
      //   })
      // },
      {
        path: '/',
        // lazy: async () =>
        //     import('./pages/main/dashboard').then((res) => {
        //       return {
        //         Component: res.default,
        //       };
        //     }),
        children: [
          // {
          //   path: '/',
          //   // lazy: async () =>
          //   //   import('./pages/main/jobs').then((res) => {
          //   //     return {
          //   //       Component: res.default,
          //   //     };
          //   //   }),
          // },

          {
            path: '/',
            lazy: async () => ({
                Component:  (await import('./pages/main/jobs')).default
            })

          },
          {
            path: '/triggers/history',
            lazy: async () => ({
                Component:  (await import('./pages/main/history')).default
            })

          }
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes, { basename: '/' });

const Router: FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
