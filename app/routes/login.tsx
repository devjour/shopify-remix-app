import { useState } from "react";
import {
  AppProvider,
  Page,
  Card,
  Layout,
  Button,
  TextField,
} from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import { LoaderFunction } from "@remix-run/node";


export const loader: LoaderFunction = async ({ request }) => {
  return {};
};

export default function Index() {
  const [url, setUrl] = useState("");

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="New Remix App">
        <Layout>
          <Layout.Section>
            <Card
              title="Login"
              sectioned
              primaryFooterAction={{
                content: "Login",
                url: `/login/initialize/${url}`,
              }}
            >
              You must log in to access this App.
              <TextField
                autoComplete="off"
                onChange={(value) => {
                  setUrl(value);
                }}
                label="URL"
                value={url}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
