import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="page-center">
      <h1>Page not found</h1>
      <Link className="btn" to="/">
        Go to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
