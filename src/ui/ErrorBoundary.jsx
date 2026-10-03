import { Component } from "react";
import { Link } from "react-router-dom";

export class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return (
        <main className="page narrow">
          <div className="state state-error">
            <span className="state-mark">!</span>
            <h1>We hit a little roadblock</h1>
            <p>This part of Addis Eats could not be displayed.</p>
            <Link className="button button-dark" to="/">
              Back home
            </Link>
          </div>
        </main>
      );
    return this.props.children;
  }
}
