import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    textUnderline: {
        '&:after': {
          borderBottom: "0",
        },
        '&:before': {
          borderBottom: "0",
        },
    },
    textRoot: {
        // paddingTop: 10,
    },
    textStyle: {
        fontSize: 20,
    },
    root: {
        // width: '100%',
    },
    outlinedRoot: {
        '& $notchedOutline': {
            top: '4px',
            bottom: '8px',
        },
        '&:hover:not($cssDisabled):not($cssFocused):not($cssError) $notchedOutline': {
            borderColor: '#388e3c',
        },
        '&$cssFocused $notchedOutline': {
            borderColor: '#388e3c',
        },
    },
    textFocusedStyle: {},
    notchedOutline: {},
    cssFocused: {},
    cssDisabled: {},
    cssError: {},
});


class EditableField extends React.Component {
    state = {
      editing: false,
      hover: false,
    };

    static defaultProps = {
        onChange: (v) => {},
        value: '',
        fullWidth: true,
    };

    mouseEnter = () => {
        this.setState({
            hover: true,
        });
    };

    mouseLeave = () => {
        this.setState({
            hover: false,
        });
    };

    enterEditMode = () => {
        this.setState({
            editing: true,
        });
    };

    leaveEditMode = () => {
        this.setState({
            editing: false,
        });
    };

    toggleEditMode = () => {
        this.setState({
            editing: !this.state.editing,
        });
    };


    onChange = (event) => {
        this.props.onChange(event.target.value);
    }

    render() {
      const { 
        classes,
        id,
        value,
        fullWidth
      } = this.props;

      const {
        hover,
        editing,
      } = this.state;

      let InputProps = {};

      let showEditMode = hover || editing;

      if (!showEditMode) {
        InputProps.classes = {
            underline: classes.textUnderline,
            root: classes.textRoot,
            input: classes.textStyle,
        };
      } else {
        InputProps.classes = {
            root: classes.outlinedRoot,
            input: classes.textFocusedStyle,
            notchedOutline: classes.notchedOutline,
            focused: classes.cssFocused,
            disabled: classes.cssDisabled,
            error: classes.cssError,
        };
      }

      return (
          <div className={classes.root}>
            <TextField
                onFocus={this.enterEditMode}
                onBlur={this.leaveEditMode}
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
                InputProps={{
                    ...InputProps,
                    readOnly: !editing,
                }}
                variant={showEditMode ? "outlined" : "standard"}
                fullWidth={fullWidth}
                id={id}
                onChange={this.onChange}
                value={value}
            />
          </div>
      );
    }
}

EditableField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditableField);
