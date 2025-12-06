"use client";

import { useSelector } from "react-redux";
export default function HelloRedux() {
  const { message } = useSelector(
    (state: { helloReducer: { message: string } }) => state.helloReducer
  );

  return (
    <div id="wd-hello-redux">
      <h3>
        Hello Redux, below will be the message displayed from the HelloReducer
      </h3>
      <h4>{message}</h4> <hr />
    </div>
  );
}
