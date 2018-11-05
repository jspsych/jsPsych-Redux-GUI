import React from 'react';
import FlatButton from 'material-ui/FlatButton';

import AddMediaIcon from 'material-ui/svg-icons/av/library-add';
import ObjectEditorIcon from 'material-ui/svg-icons/editor/mode-edit';
import ArrayIcon from 'material-ui/svg-icons/action/view-array';
import KeyboardIcon from 'material-ui/svg-icons/hardware/keyboard';

const colors = {
    ...theme.colors,
    labelColor: '#757575',
    triggerBackground: 'rgba(153, 153, 153, 0.15)',
    triggerHoverColor: 'rgba(153, 153, 153, 0.25)',
}

const style = {
    TriggerStyle: {
        backgroundColor: colors.triggerBackground,
        hoverColor: colors.triggerHoverColor,
        labelStyle: utils.prefixer({
            color: colors.labelColor,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }),
        style: {
            maxWidth: '220px'
        },
        labelPosition: 'before',
    },
    TriggerIconStyle: {
        color: colors.labelColor,
        hoverColor: colors.secondaryDeep,
        style: utils.prefixer({
            width: 16,
            height: 16,
        })
    },
    UndefinedStyle: {
        backgroundColor: colors.triggerBackground,
        hoverColor: colors.triggerHoverColor,
    },
    CustomFloatingLabelField: {
        root: utils.prefixer({
            backgroundColor: 'transparent',
            fontFamily: 'Roboto, sans-serif',
            cursor: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '10px',
            marginBottom: '5px',
        }),
        FloatingLabel: utils.prefixer({
            zIndex: '1',
            transform: 'scale(0.95) translate(-1px, -3px)',
            transformOrigin: 'left top 0px',
            pointerEvents: 'none',
            userSelect: 'none',
            color: 'rgba(0, 0, 0, 0.3)',
            display: 'inline-block',
            maxWidth: '100%',
            fontWeight: '700',
            fontSize: '13px',
            margin: 0,
        }),
        FieldGroup: utils.prefixer({
            display: 'flex',
            alignItems: 'center'
        }),
        ContentGroup: error => (utils.prefixer({
            flexGrow: 1,
            borderBottom: error ? `2.5px solid ${colors.errorRed}` : `none`,
            // borderBottom: error ? `2.5px solid ${colors.errorRed}` : `1px solid ${colors.dividerColor}`,
            paddingBottom: error ? '5px' : '0px',
        })),
        ErrorText: utils.prefixer({
            color: colors.errorRed,
            // fontWeight: 'bold',
            fontSize: '12px',
            paddingTop: '5px',
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
            lineHeight: '12px'
        }),
        ToggleGroup: utils.prefixer({
            flexBasis: 'auto',
            alignSelf: 'flex-end',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-evenly',
            backgroundColor: 'inherit',
            marginLeft: '10px'
        })
        ,
    },
}

const CommonComponents = {
    /*
    Keep them seperate in case of future changes
    */
    Triggers: {
        ObjectEditor: ({label="Edit Object", onClick=()=>{}}) => (
            <FlatButton
                {...style.TriggerStyle}
                label={label}
                onClick={onClick}
                icon={<ObjectEditorIcon {...style.TriggerIconStyle}/>}
            />
        ),
        ArrayEditor: ({label="Edit Array", onClick=()=>{}}) => (
            <FlatButton
                {...style.TriggerStyle}
                label={label}
                onClick={onClick}
                icon={<ArrayIcon {...style.TriggerIconStyle}/>}
            />
        ),
        CodeEditor: ({label="Edit Code", onClick=()=>{}}) => (
            <FlatButton
                {...style.TriggerStyle}
                label={label}
                onClick={onClick}
                icon={<ObjectEditorIcon {...style.TriggerIconStyle}/>}
            />
        ),
        TimelineVariableSelector: ({label="Timeline Variables", onClick=()=>{}}) => (
            <FlatButton
                {...style.TriggerStyle}
                label={label}
                onClick={onClick}
                icon={<ObjectEditorIcon {...style.TriggerIconStyle}/>}
            />
        ),
        MediaSelector: ({label="Media Manager", onClick=()=>{}}) => (
            <FlatButton
                {...style.TriggerStyle}
                labelStyle={{
                    ...style.TriggerStyle.labelStyle,
                    textTransform: 'none',
                }}
                icon={<AddMediaIcon {...style.TriggerIconStyle}/>}
                label={label}
                onClick={onClick}
            />
        ),
        KeyboardSelector: ({label="Key Choices", onClick=()=>{}}) => (
            <FlatButton
                {...style.TriggerStyle}
                labelStyle={{
                    ...style.TriggerStyle.labelStyle,
                    textTransform: 'none',
                }}
                icon={<KeyboardIcon {...style.TriggerIconStyle}/>}
                label={label}
                onClick={onClick}
            />
        )
    },
    Undefined: ({props={}}) => (
                <FlatButton
                    disabled
                    label={'[Undefined]'}
                    {...props}
                    {...style.UndefinedStyle}
                />
    ),
    CustomFloatingLabelField: ({label, node=null, ToggleFunc=null, ToggleTV=null, error=false, errorText=''}) => (
        <div style={{...style.CustomFloatingLabelField.root}}>
            <label style={{...style.CustomFloatingLabelField.FloatingLabel}}>
                {label}
            </label>
            <div style={{...style.CustomFloatingLabelField.FieldGroup}}>
                <div style={{...style.CustomFloatingLabelField.ContentGroup(error)}}>
                    {node}
                </div>
                <div style={{...style.CustomFloatingLabelField.ToggleGroup}}>
                    {ToggleFunc}
                    {ToggleTV}
                </div>
            </div> 
            {error ? 
                <span style={{...style.CustomFloatingLabelField.ErrorText}}>
                    {errorText}
                </span> :
                null
            }
        </div>
    )
}

export {
    CommonComponents,
    style
};