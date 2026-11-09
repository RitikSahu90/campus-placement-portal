import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <main id="main-content" className="container-page py-24 text-center">
      <p className="eyebrow">404 · A little off the path</p>
      <h1 className="display mt-5 text-5xl">Let’s find your way back.</h1>
      <p className="muted mt-5">
        That page doesn’t exist, but your next opportunity might.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link className="btn-primary" to="/jobs">
          Find opportunities
        </Link>
        <Link className="btn-secondary" to="/">
          Back to Campus
        </Link>
      </div>
    </main>
  );
}
