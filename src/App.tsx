import { Route, Routes } from "react-router-dom";
import { RepoManager, SingleIssue } from "./features/repositories/repository";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RepoManager />} />
      <Route path="/issues/:number" element={<SingleIssue />} />
    </Routes>
  );
}

export default App;
