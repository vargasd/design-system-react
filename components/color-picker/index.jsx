import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import classNames from 'classnames';

import checkProps from './check-props';

import CustomColor from './private/custom-color';
import Swatch from './private/swatch';
import SwatchPicker from './private/swatch-picker';

import Button from '../button';
import Dialog from '../utilities/dialog';
import Input from '../forms/input';
import Tabs from '../tabs';
import TabsPanel from '../tabs/panel';

import ColorUtils from '../../utilities/color';

import { COLOR_PICKER } from '../../utilities/constants';

const propTypes = {
	/**
	 * **Assistive text for accessibility**
	 * * `hueSlider`: Instructions for hue selection input
	 * * `label`: Alternative to `label` prop for hidden label
	 * * `saturationValueGrid`: Instructions for using the grid for saturation
	 * and value selection
	 */
	assistiveText: PropTypes.shape({
		hueSlider: PropTypes.string,
		label: PropTypes.string,
		saturationValueGrid: PropTypes.string,
	}),
	/**
	 * CSS classes to be added to the colorpicker control node
	 */
	className: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * CSS classes to be added to the colorpicker popover node
	 */
	classNameMenu: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
	/**
	 * Disables the input and button
	 */
	disabled: PropTypes.bool,
	/**
	 * Prevents the dropdown from changing position based on the viewport/window. If set to true your dropdowns can extend outside the viewport _and_ overflow outside of a scrolling parent. If this happens, you might want to consider making the dropdowns contents scrollable to fit the menu on the screen. `hasStaticAlignment` disables this behavior and allows this component to extend beyond boundary elements. _Not tested._
	 */
	hasStaticAlignment: PropTypes.bool,
	/**
	 * Unique ID for component
	 */
	id: PropTypes.string,
	/**
	 * Popover open state
	 */
	isOpen: PropTypes.bool,
	/**
	 * Label for colorpicker control
	 */
	label: PropTypes.string,
	/**
	 * **Text labels for internationalization**
	 * * `blueAbbreviated`: One letter abbreviation of blue color component
	 * * `cancelButton`: Text for cancel button on popover
	 * * `customTab`: Text for custom tab of popover
	 * * `greenAbbreviated`: One letter abbreviation of green color component
	 * * `hexLabel`: Label for input of hexadecimal color
	 * * `invalidColor`: Error message when hex color input is invalid
	 * * `invalidComponent`: Error message when a component input is invalid
	 * * `redAbbreviated`: One letter abbreviation of red color component
	 * * `swatchTab`: Label for swatch tab of popover
	 * * `submitButton`: Text for submit/done button of popover
	 */
	labels: PropTypes.shape({
		blueAbbreviated: PropTypes.string,
		cancelButton: PropTypes.string,
		customTab: PropTypes.string,
		greenAbbreviated: PropTypes.string,
		hexLabel: PropTypes.string,
		invalidColor: PropTypes.string,
		invalidComponent: PropTypes.string,
		redAbbreviated: PropTypes.string,
		swatchTab: PropTypes.string,
		submitButton: PropTypes.string,
	}),
	/**
	 * Please select one of the following:
	 * * `absolute` - (default) The dialog will use `position: absolute` and style attributes to position itself. This allows inverted placement or flipping of the dialog.
	 * * `overflowBoundaryElement` - The dialog will overflow scrolling parents. Use on elements that are aligned to the left or right of their target and don't care about the target being within a scrolling parent. Typically this is a popover or tooltip. Dropdown menus can usually open up and down if no room exists. In order to achieve this a portal element will be created and attached to `body`. This element will render into that detached render tree.
	 * * `relative` - No styling or portals will be used. Menus will be positioned relative to their triggers. This is a great choice for HTML snapshot testing.
	 */
	menuPosition: PropTypes.oneOf([
		'absolute',
		'overflowBoundaryElement',
		'relative',
	]),
	/**
	 * Triggered when the olor changes. It receives and event object that
	 * originally triggered the change, as well as an object in the shape `{
	 * color: [string] }`, which is a hex representation of the color.
	 */
	onChange: PropTypes.func,
	/**
	 * Function called when the dialog is closed.
	 */
	onClose: PropTypes.func,
	/**
	 * Function called when the dialog is opened.
	 */
	onOpen: PropTypes.func,
	/**
	 * Function called when the dialog would like to close.
	 */
	onRequestClose: PropTypes.func,
	/**
	 * Function called when the dialog would like to show.
	 */
	onRequestOpen: PropTypes.func,
	/**
	 * An array of hex color values which is used to set the options of the
	 * swatch tab of the colorpicker popover.
	 */
	swatchColors: PropTypes.arrayOf(PropTypes.string),
	/**
	 * Current color (in hexadecimal string)
	 */
	value: PropTypes.string,
};

const defaultProps = {
	assistiveText: {
		saturationValueGrid:
			'Use arrow keys to select a saturation and brightness, on an x and y axis.',
		label: 'Choose Color',
		hueSlider: 'Select Hue',
	},
	label: 'Choose Color',
	labels: {
		blueAbbreviated: 'B',
		cancelButton: 'Cancel',
		customTab: 'Custom',
		greenAbbreviated: 'G',
		hexLabel: 'Hex',
		invalidColor: 'The color entered is invalid',
		invalidComponent: 'The value needs to be an integer from 0-255',
		redAbbreviated: 'R',
		submitButton: 'Done',
		swatchTab: 'Default',
	},
	menuPosition: 'absolute',
	swatchColors: [
		'#e3abec',
		'#c2dbf7',
		'#9fd6ff',
		'#9de7da',
		'#9df0c0',
		'#fff099',
		'#fed49a',
		'#d073e0',
		'#86baf3',
		'#5ebbff',
		'#44d8be',
		'#3be282',
		'#ffe654',
		'#ffb758',
		'#bd35bd',
		'#5779c1',
		'#5679c0',
		'#00aea9',
		'#3cba4c',
		'#f5bc25',
		'#f99221',
		'#580d8c',
		'#001970',
		'#0a2399',
		'#0b7477',
		'#0b6b50',
		'#b67e11',
		'#b85d0d',
	],
	value: 'transparent',
};

class ColorPicker extends React.Component {
	static displayName = COLOR_PICKER;
	static propTypes = propTypes;
	static defaultProps = defaultProps;

	constructor (props) {
		super(props);

		this.generatedId = this.props.id || shortid.generate();

		this.handleRequestClose = this.handleRequestClose.bind(this);
		this.handleHexInputChange = this.handleHexInputChange.bind(this);
		this.handleSaturationValueChange = this.handleSaturationValueChange.bind(
			this
		);
		this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
		this.handleSwatchButtonClick = this.handleSwatchButtonClick.bind(this);
		this.handleSwatchSelect = this.handleSwatchSelect.bind(this);

		this.state = {
			currentColor: this.props.value,
			disabled: this.props.disabled,
			isOpen: this.props.isOpen,
			workingColor: ColorUtils.getNewColor({
				hex: this.props.value,
			}),
		};
	}

	componentWillMount () {
		checkProps(COLOR_PICKER, this.props);
	}

	// use getDerivedStateFromProps when available
	componentWillReceiveProps (nextProps) {
		const nextState = {};

		if (nextProps.value !== undefined) {
			nextState.currentColor = nextProps.value;
			nextState.workingColor = ColorUtils.getNewColor({
				hex: nextProps.value,
			});
		}

		if (nextProps.disabled !== undefined) {
			nextState.disabled = nextProps.disabled;
		}

		this.setState(nextState);
	}

	getDialog () {
		return this.state.isOpen ? (
			<Dialog
				align="bottom left"
				contentsClassName={classNames(
					'slds-color-picker__selector slds-popover',
					this.props.classNameMenu
				)}
				hasStaticAlignment={this.props.hasStaticAlignment}
				onClose={this.props.onClose}
				onOpen={this.props.onOpen}
				onRequestTargetElement={() => this.wrapper}
				position={this.props.menuPosition}
			>
				<div className="slds-popover__body">
					<Tabs>
						<TabsPanel label={this.props.labels.swatchTab}>
							<SwatchPicker
								color={this.props.workingColor}
								onSelect={this.handleSwatchSelect}
								swatchColors={this.props.swatchColors}
							/>
						</TabsPanel>
						<TabsPanel label={this.props.labels.customTab}>
							<CustomColor
								assistiveText={this.props.assistiveText}
								id={this.generatedId}
								color={this.state.workingColor}
								labels={this.props.labels}
								onBlueChange={this.handleColorChange('blue')}
								onGreenChange={this.handleColorChange('green')}
								onHexChange={this.handleColorChange('hex')}
								onHueChange={this.handleColorChange('hue')}
								onRedChange={this.handleColorChange('red')}
								onSaturationValueChange={this.handleSaturationValueChange}
								onSaturationNavigate={this.handleNavigate('saturation')}
								onValueNavigate={this.handleNavigate('value')}
							/>
						</TabsPanel>
					</Tabs>
				</div>
				<footer className="slds-popover__footer">
					<div className="slds-color-picker__selector-footer">
						<Button
							className="slds-color-picker__selector-cancel"
							label={this.props.labels.cancelButton}
							onClick={this.handleRequestClose}
							variant="neutral"
						/>
						<Button
							className="slds-color-picker__selector-submit"
							label={this.props.labels.submitButton}
							onClick={this.handleSubmitButtonClick}
							variant="brand"
						/>
					</div>
				</footer>
			</Dialog>
		) : null;
	}

	setWorkingColor (event, color) {
		const newColor = ColorUtils.getNewColor(color, this.state.workingColor);
		this.setState({
			workingColor: newColor,
		});

		if (this.props.onWorkingColorChange) {
			this.props.onWorkingColorChange(event, { color: newColor });
		}
	}

	handleColorChange (property) {
		return (event) => {
			const colorProperties = {};
			colorProperties[property] = event.target.value;
			this.setWorkingColor(event, colorProperties);
		};
	}

	handleHexInputChange (event) {
		const currentColor = event.target.value;
		const isValid = ColorUtils.isValidHex(event.target.value);
		this.setState({
			currentColor,
			colorErrorMessage: isValid ? '' : this.props.labels.invalidColor,
		});

		if (this.props.onChange && isValid) {
			this.props.onChange(event, {
				color: currentColor,
			});
		}
	}

	handleNavigate (property) {
		return (event, { delta }) => {
			const colorProperties = {};
			colorProperties[property] = delta;
			const newColor = ColorUtils.getDeltaColor(
				colorProperties,
				this.state.workingColor
			);
			this.setState({
				workingColor: newColor,
			});

			if (this.props.onWorkingColorChange) {
				this.props.onWorkingColorChange(event, { color: newColor });
			}
		};
	}

	handleRequestClose () {
		if (this.props.onRequestClose) {
			this.props.onRequestClose();
		} else {
			this.setState({
				isOpen: false,
			});
		}
	}

	handleRequestOpen () {
		if (this.props.onRequestOpen) {
			this.props.onRequestOpen();
		} else {
			this.setState({
				isOpen: true
			});
		}
	}

	handleSaturationValueChange (event, { saturation, value }) {
		this.setWorkingColor(event, {
			saturation,
			value,
		});
	}

	handleSubmitButtonClick (event) {
		this.setState({
			currentColor: this.state.workingColor.hex,
			colorErrorMessage: '',
		});

		if (this.props.onRequestClose) {
			this.props.onRequestClose();
		} else {
			this.setState({
				isOpen: false
			});
		}

		if (this.props.onChange) {
			this.props.onChange(event, {
				color: this.state.workingColor.hex,
			});
		}
	}

	handleSwatchButtonClick () {
		if (!this.state.isOpen && this.props.onRequestOpen) {
			this.handleRequestOpen();
		} else if (this.state.isOpen) {
			this.handleRequestClose();
		}
	}

	handleSwatchSelect (event, { hex }) {
		this.setWorkingColor(event, {
			hex,
		});
	}

	render () {
		return (
			<div
				className={classNames('slds-color-picker', this.props.className)}
				ref={(node) => {
					this.wrapper = node;
				}}
			>
				<div className="slds-color-picker__summary">
					<label
						className="slds-color-picker__summary-label"
						htmlFor={`color-picker-summary-input-${this.generatedId}`}
					>
						{this.props.labels.label}
					</label>
					<p className="slds-assistive-text">
						{this.props.assistiveText.label}
					</p>
					<Button
						className="slds-color-picker__summary-button"
						disabled={this.props.disabled}
						iconClassName="slds-m-left_xx-small"
						iconPosition="right"
						iconVariant="more"
						label={<Swatch color={this.state.currentColor} />}
						onClick={this.handleSwatchButtonClick}
						variant="icon"
					/>
					<Input
						aria-describedby={`color-picker-summary-error-${this.generatedId}`}
						disabled={this.props.disabled}
						className={classNames('slds-color-picker__summary-input', {
							'slds-has-error': !!this.state.colorErrorMessage,
						})}
						id={`color-picker-summary-input-${this.generatedId}`}
						onChange={this.handleHexInputChange}
						value={this.state.currentColor}
					/>
					{this.getDialog()}
					{!this.state.isOpen && this.state.colorErrorMessage ? (
						<p
							className="slds-form-error"
							id={`color-picker-summary-error-${this.generatedId}`}
						>
							{this.state.colorErrorMessage}
						</p>
					) : (
						''
					)}
				</div>
			</div>
		);
	}
}

export default ColorPicker;
