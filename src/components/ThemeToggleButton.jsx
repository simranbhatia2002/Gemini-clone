// ThemeToggleButton.jsx
import { useContext } from "react";
import { Context } from "../context/Context";
import sunIcon from "../assets/light.png";
import moonIcon from "../assets/dark.png";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(Context);

  return (
    <img
      src={theme === "light" ? moonIcon : sunIcon}
      alt="Toggle Theme"
      className="theme-icon"
      onClick={toggleTheme}
    />
  );
};

export default ThemeToggleButton;
