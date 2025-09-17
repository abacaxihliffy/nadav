import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Curriculum from "./pages/Curriculum";
import Forum from "./pages/Forum";
import News from "./pages/News";
import Learn from "./pages/Learn";

function NotFound() {
  return (
    <div className="container-lg py-10">
      <h1 className="text-2xl font-bold">404 — Page not found</h1>
      <p className="mt-4 text-gray-700">Try the Curriculum or Home.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/news" element={<News />} />
          <Route path="/learn/:trackId" element={<Learn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
