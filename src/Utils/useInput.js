import { useState } from "react";

function useInput(initialValue) {
  const [value, setValue] = useState(`${initialValue ? initialValue : ""}`);
  function onChange(event) {
    setValue(event.target.value);
  }
  return { value, onChange };
}

export default useInput;