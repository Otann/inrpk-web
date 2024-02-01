import { cssBundleHref } from '@remix-run/css-bundle';
import type {
  HeadersFunction,
  LinksFunction,
  MetaFunction,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import carbonCss from './styles/carbon.css';
import globalCss from './styles/global.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: carbonCss },
  { rel: 'stylesheet', href: globalCss },

  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap',
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: 'ИНРПК Админ' },
    { name: 'description', content: 'Сила в правде' },
  ];
};

// https://remix.run/docs/en/main/route/headers
// https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
// export const headers: HeadersFunction = () => ({
//   'X-Frame-Options': 'DENY',
//   'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
//   'Content-Security-Policy': 'strict-dynamic',
//   'X-Content-Type-Options': 'nosniff',
//   'Referrer-Policy': 'strict-origin-when-cross-origin',
// });

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
