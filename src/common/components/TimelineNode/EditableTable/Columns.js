import React from 'react';

class Columns extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			editing: false 
		}

		this.onEditHeader {
			this.setState({
				editing: !editing
			});
		}
	}

	render() {
		return (
			<div className="tableHeader">
				<div className="headerTitle">
					<td id={this.props.headerId}
					onClick={this.sonEditHeader}
					onInput={(event) => this.props.onInputTitle(event.target.innerHTML)} />
				</div>
			</div>
			)
	}
}

export default Columns;