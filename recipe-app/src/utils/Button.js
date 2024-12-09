import { memo } from "react";
import PropTypes from "prop-types";
import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";

import CustomText from './CustomText';

const Button = (props) => {
	const {
		children,
		onPress,
		style,
		textStyle,
		disabled = false,
		isLoading = false
	} = props;

	const buttonContainerStyles = StyleSheet.flatten([
		{
			minWidth: 46,
			backgroundColor: disabled ? "rgba(0,0,0,0.1)" : "#00a097",
			paddingVertical: 10,
			borderRadius: 4
		},
		style
	]);

	const buttonTextStyles = StyleSheet.flatten([
		{
			textAlign: "center",
			color: disabled ? "rgba(0,0,0,0.2)" : "white",
			fontSize: 12
		},
		textStyle
	]);

	return (
		<TouchableOpacity
			onPress={onPress}
			style={buttonContainerStyles}
			disabled={disabled || isLoading}
		>
			{isLoading ? (
				<ActivityIndicator color="white" />
			) : (
				<CustomText bold style={buttonTextStyles}>
					{children}
				</CustomText>
			)}
		</TouchableOpacity>
	);
};

Button.propTypes = {
	children: PropTypes.node,
	onPress: PropTypes.func,
	style: PropTypes.any,
	textStyle: PropTypes.any,
	disabled: PropTypes.bool,
	isLoading: PropTypes.bool
};

export default memo(Button);
