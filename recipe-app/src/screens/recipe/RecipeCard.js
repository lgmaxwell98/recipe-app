import PropTypes from "prop-types";

import { StyleSheet, View, Dimensions, TouchableOpacity, Image } from "react-native";
import CustomText from "../../utils/CustomText";

import noImage from "../../../assets/no_image.png";
import { useNavigation } from "@react-navigation/native";


const screenWidth = Dimensions.get("window").width;

const RecipeCard = (props) => {
	const { data } = props;
	const navigation = useNavigation();

	const imageSource = data.imageUri ? data.imageUri
		: noImage;

		console.log('imageSource', imageSource)

	return (
		<TouchableOpacity
			onPress={() => navigation.push("RecipeDetailScreen", { recipe: data })}
		>
			<View style={styles.cardContainer}>
				<View
					style={{
						aspectRatio: 1 / 1,
						width: screenWidth / 2 - 5,
						padding: 10
					}}
				>
					<Image
						source={{ uri: imageSource }}
						style={{
							flex: 1,
							borderRadius: 4,
							borderWidth: 2,
							borderColor: "#d3d3d3"
						}}
						resizeMode="cover"
					/>
				</View>
			</View>
			<View
				style={[styles.recipeWrapper, { justifyContent: "flex-end", top: -10 }]}
			>
				<View style={styles.recipeNameContainer}>
					<CustomText
						style={{
							fontSize: 15,
							color: "white",
							textAlign: "center",
							fontFamily: "Montserrat-Bold"
						}}
						numberOfLines={2}
					>
						{data.title}
					</CustomText>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	cardContainer: {
		backgroundColor: "white",
		position: "relative",
		width: screenWidth / 2 - 24,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 4,
		marginBottom: 10
	},
	recipeWrapper: {
		position: "absolute",
		display: "flex",
		width: "100%",
		height: "100%",
		alignItems: "center",
		marginBottom: 10
	},
	recipeNameContainer: {
		backgroundColor: "#00a097",
		borderRadius: 20,
		width: "auto",
		paddingHorizontal: 15,
		paddingVertical: 5,
		justifyContent: "center",
		alignItems: "center"
	}
});

RecipeCard.propTypes = {
	data: PropTypes.object
};

export default RecipeCard;
