import React, { useState } from "react";
import PerformanceResultTable from "./PerformanceResultTable";
import StudentInnovation from './StudentInnovation';
import Hello from './Hello';
import Assessment from './Assessment';
import StudentTable from "./StudentTable";
export default function HandlingNextPrev() {
  const [count, setCount] = useState(1);
  const next = () => {
    if (count < 5) {
      setCount(count + 1);
    }
  };

  const previous = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const render = () => {
    switch (count) {
      case 1:
        return <Assessment next={next}   />;
      case 2:
        return <Hello next={next} previous={previous}   />;
      case 3:
        return <PerformanceResultTable next={next} previous={previous}   />;
      case 4:
        return <StudentTable next={next} previous={previous}  />;
      case 5:
        return <StudentInnovation previous={previous}   />;
      default:
        return null;
    }
  };

  return (
    <div>
      {render()}
    </div>
  );
}