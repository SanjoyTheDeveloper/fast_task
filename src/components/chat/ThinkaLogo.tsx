import * as React from "react";

export function ThinkaLogo({
  className = "h-5 w-5 text-[#315BFF]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Radiant multi-spoke sunburst matching Thinka design screenshot */}
      <path d="M12 1.75a1 1 0 0 1 1 1v3.5a1 1 0 1 1-2 0v-3.5a1 1 0 0 1 1-1zm0 14a1 1 0 0 1 1 1v3.5a1 1 0 1 1-2 0v-3.5a1 1 0 0 1 1-1zm9.25-4.75a1 1 0 0 1-1 1h-3.5a1 1 0 1 1 0-2h3.5a1 1 0 0 1 1 1zM7.25 12a1 1 0 0 1-1 1h-3.5a1 1 0 1 1 0-2h3.5a1 1 0 0 1 1 1zm11.29-6.54a1 1 0 0 1 0 1.415l-2.475 2.475a1 1 0 1 1-1.414-1.415l2.475-2.474a1 1 0 0 1 1.414 0zM7.889 16.111a1 1 0 0 1 0 1.415l-2.475 2.474a1 1 0 0 1-1.414-1.414l2.475-2.475a1 1 0 0 1 1.414 0zm10.651 0a1 1 0 0 1 1.415 1.415l-2.475 2.474a1 1 0 0 1-1.414-1.414l2.474-2.475a1 1 0 0 1 0-1.414zM6.475 4.045a1 1 0 0 1 1.414 1.415L5.414 7.934a1 1 0 1 1-1.414-1.414l2.475-2.475z" />
    </svg>
  );
}

export default ThinkaLogo;
