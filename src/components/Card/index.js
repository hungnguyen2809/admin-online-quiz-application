import React from "react";
import PropTypes from "prop-types";
import "./Card.css";
import { Colors } from "./../../constants/Styles";

Card.propTypes = {
	bgClolor: PropTypes.string,
	textColor: PropTypes.string,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	icon: PropTypes.any,
};

Card.defaultProps = {
	bgClolor: Colors.CLEAR_CHILL,
	textColor: Colors.WHITE,
};

function Card(props) {
	const { bgClolor, textColor, title, description, icon } = props;

	return (
		<div className="card" style={{ backgroundColor: bgClolor }}>
			<div>
				<h3 style={{ color: textColor }}>{title}</h3>
				<h4 style={{ color: textColor }}>{description}</h4>
			</div>
			{icon || null}
		</div>
	);
}

export default Card;
