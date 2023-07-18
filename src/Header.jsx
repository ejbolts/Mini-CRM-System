import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState } from "react";
import styled from "@mui/material/styles/styled";

const buttonStyle = {
  width: 100,
  padding: "20px",
};

const menuItems = [
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/deals", label: "DEALS" },
  { href: "/briefs", label: "BRIEFS" },
  { href: "/proposals", label: "PROPOSALS", color: "grey" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/websites", label: "WEBSITES" },
  { href: "/evolution", label: "EVOLUTION" },
  { href: "/support", label: "SUPPORT" },
];

const UnderlineButton = styled(Button)(({ theme }) => ({
  position: "relative",
  "&::before": {
    content: "''",
    position: "absolute",
    width: "0",
    height: "3px",
    bottom: 0,
    left: 0,
    backgroundColor: "White",
    transition: "width 0.3s ease-in-out",
  },
  "&:hover": {
    "&::before": {
      width: "100%",
    },
  },
  "@keyframes underline": {
    "0%": {
      transform: "scaleX(0)",
    },
    "100%": {
      transform: "scaleX(1)",
    },
  },
}));

export default function Header() {
  const handleClick = () => {
    setToggleColour(!toggleColour);
  };
  const [toggleColour, setToggleColour] = useState(false);

  return (
    <AppBar position="static" sx={{ background: "#191b1c" }}>
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, padding: 0 }}
        >
          Logo
        </Typography>
        {menuItems.map(({ href, label, color }) => (
          <UnderlineButton
            key={label}
            style={buttonStyle}
            href={href}
            color="inherit"
            sx={{ color: color }}
            onClick={handleClick}
          >
            {label}
          </UnderlineButton>
        ))}
      </Toolbar>
    </AppBar>
  );
}
