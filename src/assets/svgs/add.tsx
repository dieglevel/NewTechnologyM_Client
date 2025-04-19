import * as React from "react";
import Svg, { Defs, G, Line, Polyline } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style, title */
const Add = ({ color = "#7C87FF", size = 23, outline = "#7C87FF" }) => (
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
		<Polyline points="2.75 8.75,6.25 12.25,13.25 4.75" />
	</Svg>
);
export default Add;
