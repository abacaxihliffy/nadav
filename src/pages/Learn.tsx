import { useParams, Link } from "react-router-dom";
import { tracks } from "../data/curriculum";

export default function Learn() {
  const { trackId } = useParams();
  const track = tracks.find(t => t.id === trackId);

  if (!track) {
    return (
      <div className="container-lg py-10">
        <h1 className="text-2xl font-bold">Track not found</h1>
        <p className="mt-4"><Link className="btn-primary" to="/curriculum">Back to Curriculum</Link></p>
      </div>
    );
  }

  return (
    <div className="container-lg py-10">
      <h1 className="text-3xl font-extrabold">{track.title}</h1>
      <p className="mt-2 text-gray-600">{track.hours} hours • {track.cert ? "Certification track" : "Practice track"}</p>

      <ol className="mt-6 space-y-2 list-decimal pl-6">
        {track.lessons.map(lesson => (
          <li key={lesson.id} className="bg-white border rounded p-4">
            {lesson.title}
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <Link to="/curriculum" className="btn-primary">Back to Curriculum</Link>
      </div>
    </div>
  );
}
