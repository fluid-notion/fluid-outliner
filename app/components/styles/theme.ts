import { createMuiTheme } from "@material-ui/core/styles";

// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=546E7A&secondary.color=AFB42B&secondary.text.color=F0F4C3&primary.text.color=ffffff
// https://codepen.io/anon/pen/jKmJMK
// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       light: "#819ca9",
//       dark: "#29434e",
//       main: "#546e7a",
//       contrastText: "#ffffff"
//     },
//     secondary: {
//       main: "#afb42b",
//       light: "#e4e65e",
//       dark: "#7c8500",
//       contrastText: "#f0f4c3"
//     }
//   }
// });

export const palette = {
  primary: {
    light: "#9a67ea",
    dark: "#320b86",
    main: "#673ab7",
    contrastText: "#e3f2fd"
  },
  secondary: {
    main: "#2196f3",
    light: "#6ec6ff",
    dark: "#0069c0",
    contrastText: "#e3f2fd"
  }
};

export const theme = createMuiTheme({
  palette
});
