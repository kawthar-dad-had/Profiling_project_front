import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import RedeemIcon from "@mui/icons-material/Redeem";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { Product } from "./Product";
import { Carts } from "./Carts";
const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "products",
    title: "Products",
    icon: <ProductionQuantityLimitsIcon />,
  },
  {
    segment: "carts",
    title: "Carts",
    icon: <RedeemIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  // Rendu conditionnel des pages
  if (pathname === "/carts") {
    return <Carts />;
  }
  if (pathname === "/products") {
    return <Product />;
  }

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardUser(props) {
  const { window } = props;
  const router = useDemoRouter("/products");

  // Définir la fenêtre dans le cas d'un rendu responsive
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        title: "kawthar",
      }}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardUser.propTypes = {
  window: PropTypes.func,
};

export default DashboardUser;
