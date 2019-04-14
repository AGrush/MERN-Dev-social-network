/**
 * Basic spinner gif component for load screens
 *
 */

import React from "react";
import spinner from "./spinner.gif";

export default function() {
  return (
    <div>
      <img
        src={spinner}
        style={{ width: "200px", margin: "autp", display: "block" }}
        alt="Loading"
      />
    </div>
  );
}
