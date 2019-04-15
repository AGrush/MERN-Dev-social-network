/**
 * Footer
 *
 * Parent: App.js
 *
 * props passed down from parent:
 * none
 */

import React from "react";

export default function Footer() {
  return (
    <footer
      style={{ marginTop: "100px" }}
      className="bg-dark text-white mt-5 p-4 text-center mb-auto"
    >
      Copyright &copy; {new Date().getFullYear()} DevNetwork
    </footer>
  );
}
