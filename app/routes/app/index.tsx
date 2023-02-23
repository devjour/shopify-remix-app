import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <ul>
        <li>
          <Link to="products">Products</Link>
        </li>
      </ul>
    </div>
  );
}
