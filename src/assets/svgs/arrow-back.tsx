import { colors } from "@/constants";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export const ArrowBack = ({ color = "#7C87FF", size = 25, outline = "#7C87FF" }) => (
	<Svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
	>
		<Path
			d="M9.57 18.82C9.38 18.82 9.19 18.75 9.04 18.6L2.97 12.53C2.68 12.24 2.68 11.76 2.97 11.47L9.04 5.4C9.33 5.11 9.81 5.11 10.1 5.4C10.39 5.69 10.39 6.17 10.1 6.46L4.56 12L10.1 17.54C10.39 17.83 10.39 18.31 10.1 18.6C9.96 18.75 9.76 18.82 9.57 18.82Z"
			fill={color}
		/>
		<Path
			d="M20.5 12.75H3.66998C3.25998 12.75 2.91998 12.41 2.91998 12C2.91998 11.59 3.25998 11.25 3.66998 11.25H20.5C20.91 11.25 21.25 11.59 21.25 12C21.25 12.41 20.91 12.75 20.5 12.75Z"
			fill={outline}
		/>
	</Svg>
);
