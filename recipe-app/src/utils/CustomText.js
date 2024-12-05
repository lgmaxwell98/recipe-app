import { memo } from "react";
import PropTypes from "prop-types";
import { Dimensions, StyleSheet, Text } from "react-native";


const CustomText = (props) => {
	const { children, style, numberOfLines, bold, semiBold } = props;
	const { width: deviceWidth } = Dimensions.get("window");
	const textFont =
		(bold && "Montserrat-Bold") ||
		(semiBold && "Montserrat-SemiBold") ||
		"Montserrat-Regular";

	const fontSize = deviceWidth < 380 ? 11 : 14;
	const customStyle = StyleSheet.flatten([
		{
			fontFamily: textFont,
			color: "black",
			fontSize
		},
		style
	]);

	return (
		<Text {...props} style={customStyle} numberOfLines={numberOfLines}>
			{children}
		</Text>
	);
};

CustomText.propTypes = {
	children: PropTypes.node,
	style: PropTypes.any,
	numberOfLines: PropTypes.number,
	bold: PropTypes.bool,
	semiBold: PropTypes.bool
};

export default memo(CustomText);
