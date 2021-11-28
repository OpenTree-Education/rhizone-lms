import createTheme from "@mui/material/styles/createTheme";

const amulet = 'hsl(104,18%,52%)';
const amuletDark = 'hsl(104,23%,42%)';
const lightMossGreen = 'hsl(104,35%,76%)';
const amuletContrastText = 'hsl(0,0%,100%)';

const paleCornflowerBlue = 'hsl(208,62%,82%)';
const paleCornflowerBlueDark  = 'hsl(208,66%,74%)';
const paleCornflowerBlueLight = 'hsl(208,62%,92%)';
const paleCornflowerBlueContrastText  = 'hsl(208,67%,18%)';

const tropicalViolet = 'hsl(284,35%,76%)';
const tropicalVioletDark  = 'hsl(284,40%,69%)';
const tropicalVioletLight = 'hsl(284,35%,86%)';
const tropicalVioletContrastText  = 'hsl(284,40%,16%)';

const cameoPink = 'hsl(347,50%,84%)';
const cameoPinkDark  = 'hsl(347,53%,77%)';
const cameoPinkLight = 'hsl(347,50%,94%)';
const cameoPinkContrastText  = 'hsl(347,55%,20%)';

const peach = 'hsl(41,100%,84%)';
const peachDark  = 'hsl(41,100%,74%)';
const peachLight = 'hsl(41,100%,94%)';
const peachContrastText  = 'hsl(41,100%,20%)';

const alabaster = 'hsl(98,19%,92%)';
const alabasterDark  = 'hsl(98,22%,85%)';
const cultured = 'hsl(210,30%,96%)';
const alabasterContrastText  = 'hsl(98,24%,32%)';

const theme = createTheme({
  palette: {
    error: {
      contrastText: cameoPinkContrastText,
      dark: cameoPinkDark,
      light: cameoPinkLight,
      main: cameoPink,
    },
    info: {
      contrastText: alabasterContrastText,
      dark: alabasterDark,
      light: cultured,
      main: alabaster,
    },
    primary: {
      contrastText: amuletContrastText,
      dark: amuletDark,
      light: lightMossGreen,
      main: amulet,
    },
    secondary: {
      contrastText: paleCornflowerBlueContrastText,
      dark: paleCornflowerBlueDark,
      light: paleCornflowerBlueLight,
      main: paleCornflowerBlue,
    },
    success: {
      contrastText: tropicalVioletContrastText,
      dark: tropicalVioletDark,
      light: tropicalVioletLight,
      main: tropicalViolet,
    },
    warning: {
      contrastText: peachContrastText,
      dark: peachDark,
      light: peachLight,
      main: peach,
    },
  },
  typography: {
    fontSize: 16
  }
});

export default theme;
