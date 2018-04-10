import React from 'react';

class Swatch extends React.Component {
	render () {
		const style = {
			backgroundColor: this.props.color,
		};

		if (this.props.color === 'transparent') {
			style.backgroundImage =
				'linear-gradient(45deg, white 45%, maroon 0, maroon 55%, white 0)';
		}

		return (
			<span className="slds-swatch" style={style}>
				<span className="slds-assistive-text">{this.props.color}</span>
			</span>
		);
	}
}

export default Swatch;
