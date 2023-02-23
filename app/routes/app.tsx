import { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { AppProvider } from "@shopify/polaris";
import shopifyStyles from "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: shopifyStyles,
    },
  ];
};

export default function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <Outlet />
    </AppProvider>
  );
}
