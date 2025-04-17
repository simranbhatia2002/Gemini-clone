import { createContext, useEffect, useState } from "react";
import runChat from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [theme, setTheme] = useState("light");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 10 * index);
  };
  const newChat = () => {
    setLoading(false);
    setShowResults(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResults(true);

    try {
      const finalPrompt = prompt?.trim() || input?.trim();
      if (!finalPrompt) {
        setLoading(false);
        return;
      }

      setPrevPrompts((prev) => [...prev, finalPrompt]);
      setRecentPrompt(finalPrompt);

      let response = await runChat(finalPrompt);

      if (!response || typeof response !== "string") {
        throw new Error("Invalid response from API");
      }

      // Format response properly
      response = response
        .replace(/\n/g, "<br/>") // Convert new lines to <br/>
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Convert **text** to <b>text</b>
        .replace(/\* (.*?)/g, "• $1"); // Convert * bullet points to •

      setResultData(response);
    } catch (error) {
      console.error("Error while running chat:", error);
      setResultData("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    input,
    setInput,
    showResults,
    loading,
    resultData,
    newChat,
    theme,
    toggleTheme,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
