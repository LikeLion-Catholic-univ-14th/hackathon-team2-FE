import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SurveyPage from "./pages/SurveyPage";
import LoadingPage from "./pages/LoadingPage";
import ResultPage from "./pages/ResultPage";
import ArchivePage from "./pages/ArchivePage";
import ArchiveDetailPage from "./pages/ArchiveDetailPage";

function App() {
  return (
    <div className="appContainer">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/archive:id" element={<ArchiveDetailPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
