import * as React from "react";
import Svg, { Defs, G, Line, Path, Polyline } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style, title */
const Delete = ({ color = "#7C87FF", size = 23, outline = "#7C87FF" }) => (
	<Svg
		viewBox="0 0 16 16"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		width={size}
		height={size}
		fill="none"
		stroke={color}
	>
		<Path d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5" />
	</Svg>
);
export default Delete;
