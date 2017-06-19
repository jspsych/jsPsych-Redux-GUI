import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class TrialItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			edit: false
		}

		this.onSelectCell = () => {
			this.setState({
				edit: true
			});
		}
	}
	render(){
		return (
			<div className="dataTableContainer">
				<table className="dataTable">
					<tbody>
					{
						this.props.sheets.map((cells, index) => {
							return <Cells />
						})
					}
					</tbody>
				</table>
			</div>
			)
	}
}