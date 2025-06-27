import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Join from "./pages/join";
import Chat from "./pages/chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
