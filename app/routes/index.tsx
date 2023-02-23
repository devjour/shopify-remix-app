import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AppProvider, Page, LegacyCard, Layout } from "@shopify/polaris";
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

export const loader: LoaderFunction = async (request) => {
  return {};
};

export default function Index() {
  return (
    <AppProvider i18n={enTranslations}>
      <Page title="New Remix App">
        <Layout>
          <Layout.Section>
            <LegacyCard title="files" sectioned>
              <ul style={{ margin: 0, paddingLeft: "0.8rem" }}>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
