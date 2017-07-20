import { connect } from 'react-redux';
import ObjectEditor from '../../components/ObjectEditor';

const setObjectKey = (dispatch, oldKey, newKey, targetObj) => {

}

const setObjectValue = (dispatch) => {
	
}


const mapStateToProps = (state, ownProps) => {
	return {
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	setObjectKey: (oldKey, newKey, targetObj) => { setObjectKey(dispatch, oldKey, newKey, targetObj); },
	setObjectValue: (key, newValue) => { }
})

export default connect(mapStateToProps, mapDispatchToProps)(ObjectEditor);

