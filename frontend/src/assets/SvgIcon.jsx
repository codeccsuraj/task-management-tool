import React from "react";

const iconPaths = {
  "circle-spin": (
    <>
      <rect width="6" height="14" x="1" y="4" fill="currentColor">
        <animate id="SVGBoZ3Ab9F" fill="freeze" attributeName="y" begin="0;SVG0XJl4OCs.end-0.25s" dur="0.75s" values="1;5" />
        <animate fill="freeze" attributeName="height" begin="0;SVG0XJl4OCs.end-0.25s" dur="0.75s" values="22;14" />
        <animate fill="freeze" attributeName="opacity" begin="0;SVG0XJl4OCs.end-0.25s" dur="0.75s" values="1;.2" />
      </rect>
      <rect width="6" height="14" x="9" y="4" fill="currentColor" opacity=".4">
        <animate fill="freeze" attributeName="y" begin="SVGBoZ3Ab9F.begin+0.15s" dur="0.75s" values="1;5" />
        <animate fill="freeze" attributeName="height" begin="SVGBoZ3Ab9F.begin+0.15s" dur="0.75s" values="22;14" />
        <animate fill="freeze" attributeName="opacity" begin="SVGBoZ3Ab9F.begin+0.15s" dur="0.75s" values="1;.2" />
      </rect><rect width="6" height="14" x="17" y="4" fill="currentColor" opacity=".3">
        <animate id="SVG0XJl4OCs" fill="freeze" attributeName="y" begin="SVGBoZ3Ab9F.begin+0.3s" dur="0.75s" values="1;5" />
        <animate fill="freeze" attributeName="height" begin="SVGBoZ3Ab9F.begin+0.3s" dur="0.75s" values="22;14" />
        <animate fill="freeze" attributeName="opacity" begin="SVGBoZ3Ab9F.begin+0.3s" dur="0.75s" values="1;.2" />
      </rect>
    </>
  ),
};

const SvgIcon = ({
  icon = "",
  size = 20,
  color = "currentColor",
  className = "",
  ...props
}) => {
  const iconContent = iconPaths[icon];

  if (!iconContent) {
    console.warn(`SvgIcon: "${icon}" icon not found.`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
      aria-hidden="true"
      {...props}
    >
      {iconContent}
    </svg>
  );
};

export default SvgIcon;