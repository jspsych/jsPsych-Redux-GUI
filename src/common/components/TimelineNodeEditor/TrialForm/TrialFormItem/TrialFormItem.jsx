import React from 'react';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';

import DeleteSubItemIcon from 'material-ui/svg-icons/navigation/close';
import CollapseIcon from 'material-ui/svg-icons/navigation/more-horiz';
import ExpandIcon from 'material-ui/svg-icons/navigation/expand-more';
import EditCodeIcon from 'material-ui/svg-icons/action/code';
import AddTimelineVarIcon from 'material-ui/svg-icons/action/swap-horiz';

import KeyboardSelector from '../../../KeyboardSelector';
import MediaManager from '../../../../containers/MediaManager';
import CodeEditor from '../../../CodeEditor';
import TimelineVariableSelector from '../../../../containers/TimelineNodeEditor/TrialForm/TimelineVariableSelectorContainer';
import ObjectEditor from '../../../../containers/ObjectEditor';
import ArrayEditor from '../../../../containers/ArrayEditor';
import TrialFormItemContainer from '../../../../containers/TimelineNodeEditor/TrialForm/TrialFormItemContainer';
import { EditorTextField } from '../../../gadgets';
import { CommonComponents } from '../../CommonComponents';
import { PathNode, locateNestedParameterInfo, isParameterRequired } from './utils.js';

const jsPsych = window.jsPsych;
const EnumPluginType = jsPsych.plugins.parameterType;

const colors = {
    ...theme.colors,
    labelColor: '#757575',
    normalToggleColor: '#414141',
    dividerColor: 'rgb(224, 224, 224)',
    disabledColor: '#B1B1B1',
    evenSubItemBackgroundColor: '#F5F5F5',
    oddSubItemBackgroundColor: '#E0E0E0'
};

const style = {
    SelectFieldToggleStyle: {
        labelStyle: {
            color: colors.secondary
        },
        selectedMenuItemStyle: {
            color: colors.secondary
        }
    },
    SelectFieldStyle: {
        selectedMenuItemStyle: {
            color: colors.secondary
        }
    },
    ToggleStyle: {
        IconButton: {
            disableTouchRipple: true,
            style: {
                width: 24,
                height: 24,
                padding: 0,
            },
            iconStyle: {
                width: 16,
                height: 16
            }
        },
        Icon: toggled => ({
            color: toggled ? 'black' : '#BFBFBF',
            hoverColor: colors.secondary
        }),
    },
    ToggleGroup: utils.prefixer({
        display: 'flex',
        justifyContent: 'space-evenly',
        backgroundColor: 'inherit',
        marginLeft: '10px'
    }),
    ComplexField: {
        expandIcon: {
            hoverColor: colors.secondary
        },
        addChildrenButtonContainer: utils.prefixer({
            float: 'right'
        }),
        addChildrenButton: utils.prefixer({
            label: "add"
        }),
        children: {
                root: {
                    paddingLeft: '20px'
                },
                sheet: {
                    root: (even) => ({
                        backgroundColor: even ? colors.evenSubItemBackgroundColor : colors.oddSubItemBackgroundColor
                    }),
                    CloseButtonContainer: {
                        float: 'right',
                        margin: 0,
                        marginRight: 5,
                        marginTop: 5
                    },
                    CLoseButton: {
                        iconStyle: {
                            width: 16,
                            height: 16
                        },
                        style: {
                            width: 16,
                            height: 16,
                            padding: 0,
                        }
                    }
                }
            }
    }
}



// const processMediaPathTag = (s) => {
//  if (!s) return "";
//  if (Array.isArray(s)) {
//      let res = [];
//      for (let i = 0; i < s.length; i++) {
//          res.push(s[i].replace(/<\/?path>/g, ''));
//          if (i < s.length - 1) res.push(",");
//      }
//      return res.join('');
//  } else {
//      return s.replace(/<\/?path>/g, '');
//  }
// }


/*
parameterValue: JspsychValueObject (defined in reducers/editor), 
parameterInfo: jsPsych parameter information object (defined in jspsych), 
autoConvertToArrayComponent: boolean
*/
const generateFieldProps = (parameterValue, parameterInfo, autoConvertToArrayComponent=true) => {
    let isRequired = isParameterRequired(parameterInfo);
    let val = utils.toEmptyString(parameterValue.value);
    let disabled = true;
    let error = isRequired && utils.isJspsychValueObjectEmpty(parameterValue);  

    switch (parameterValue.mode) {
        case enums.ParameterMode.USE_FUNC:
            val = '[Custom Code]';
            break;
        case enums.ParameterMode.USE_TV:
            val = '[Timeline Variable]';
            break;
        default:
            disabled = false;
    }

    return {
        value: val,
        disabled: disabled,
        floatingLabelText: parameterInfo.pretty_name,
        errorText: error ? 'This parameter is required.' : '',
        floatingLabelFixed: true,
        title: parameterInfo.description,
        style: { marginBottom: error ? '15px' : '0px' },
        ...theme.TextFieldFocusStyle(error),
    }
}

/*
this.props should have: {
    param: Field name of a plugin's parameter
    paramInfo: jsPsych.plugins[Plugin Type].info.parameters[Field Name]
}
*/
export default class TrialFormItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subFormCollapse: false,
        }

        this.toggleSubFormCollapse = () => {
            this.setState({
                subFormCollapse: !this.state.subFormCollapse
            })
        }
    }

    static defaultProps = {
        paramInfo: "",
        param: "",
    }

    renderToggleFunc = ({param, parameterValue, parameterInfo}) => (
        <IconButton
            onClick={() => { this.props.setParamMode(param); }}
            {...style.ToggleStyle.IconButton}
        >
            <EditCodeIcon {...style.ToggleStyle.Icon(parameterValue.mode === enums.ParameterMode.USE_FUNC)}/>
        </IconButton>
    )

    renderToggleTV = ({param, parameterValue, parameterInfo}) => (
        <IconButton
            {...style.ToggleStyle.IconButton}
            onClick={() => { this.props.setParamMode(param, enums.ParameterMode.USE_TV); }}
        >
            <AddTimelineVarIcon {...style.ToggleStyle.Icon(parameterValue.mode === enums.ParameterMode.USE_TV)}/>
        </IconButton>
    )

    renderField = ({
        param,
        parameterValue,
        parameterInfo,
        node = null,
        autoConvertToArrayComponent = true,
        forceCustomFloatingLabel = false,
        onlyFunction = false,
    }) => {
        let useFunc = parameterValue.mode === enums.ParameterMode.USE_FUNC,
            useTV = parameterValue.mode === enums.ParameterMode.USE_TV,
            customFloatingLabel = true,
            isRequired = isParameterRequired(parameterInfo),
            error = isRequired && utils.isJspsychValueObjectEmpty(parameterValue);  

        if (useFunc) {
            node = (
                <CodeEditor 
                    Trigger={CommonComponents.Triggers.CodeEditor}
                    value={utils.toEmptyString(parameterValue.func.code)} 
                    ifEval={!!parameterValue.func.ifEval}
                    language={parameterValue.func.language}
                    onCommit={(newCode, ifEval, language) => { 
                      this.props.setFunc(param, newCode, ifEval, language);
                    }}
                    onlyFunction={onlyFunction}
                    title={`${parameterInfo.pretty_name}: `}
                />
            )
        } else if (useTV) {
            node = (
                <TimelineVariableSelector 
                    Trigger={CommonComponents.Triggers.TimelineVariableSelector}
                    title={`${parameterInfo.pretty_name}: `}
                    value={parameterValue.timelineVariable}
                    onCommit={(newTV) => {
                        this.props.setTimelineVariable(param, newTV);
                    }}
                />
            )
        } else if (!!parameterInfo.array && autoConvertToArrayComponent) {
            let val = utils.toEmptyArray(parameterValue.value), label;
            if (Array.isArray(val)) {
                label = val.length > 1 ? `${val.length} Array Items` : `${val.length} Array Item`;
            } else {
                label = '0 Array Item';
            }
            node = (
                <ArrayEditor
                    Trigger={({onClick}) => (CommonComponents.Triggers.ArrayEditor({label: label, onClick: onClick}))}
                    value={val}
                    title={`${parameterInfo.pretty_name}: `}
                    keyName={param}
                    onCommit={(obj) => { this.props.setObject(param, obj); }}
                />
            )
        } else {
            customFloatingLabel = false;
        }

        let args = {
            param: param,
            parameterValue: parameterValue,
            parameterInfo: parameterInfo,
        }
        let ToggleFunc = this.renderToggleFunc(args);
        let ToggleTV = this.renderToggleTV(args);

        return (customFloatingLabel || forceCustomFloatingLabel ?
            <div className="Trial-Form-Item-Container">
                <CommonComponents.CustomFloatingLabelField
                    label={parameterInfo.pretty_name}
                    node={node}
                    ToggleFunc={ToggleFunc}
                    ToggleTV={ToggleTV}
                    error={error}
                    errorText={error ? 'This parameter is required.' : ''}
                />
            </div> :
            <div className="Trial-Form-Item-Container">
                {node}
                <div style={{...style.ToggleGroup}}>
                    {ToggleFunc}
                    {ToggleTV}
                </div>
            </div>
            );
    }

    renderTextField = (param) => {
        let parameterValue = utils.locateNestedParameterValue(this.props.parameters, param);
        let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
        let args = {
            param: param,
            parameterValue: parameterValue,
            parameterInfo: parameterInfo,
            node: (
                <EditorTextField
                    onCommit = {(v) => { this.props.setText(param, v); }}
                    id={"text-field-"+param}
                    min={-1}
                    fullWidth={true}
                    onChange={(e, v) => { this.props.setText(param, v); }}
                    {...generateFieldProps(parameterValue, parameterInfo)}
                />
            )
        }
        return this.renderField(args);
    }

    renderNumberField = (param) => {
        let parameterValue = utils.locateNestedParameterValue(this.props.parameters, param),
            parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param),
            props = generateFieldProps(parameterValue, parameterInfo);
        props.type = props.disabled ? 'text' : 'number';
        let args = {
            param: param,
            parameterValue: parameterValue,
            parameterInfo: parameterInfo,
            node: (
                <EditorTextField
                  type="number"
                  id={"number-field-"+param}
                  fullWidth={true}
                  onCommit={(v) => {
                        this.props.setNumber(param, v, EnumPluginType.FLOAT===this.props.paramInfo.type);
                    }}
                  {...props}
                />
            )
        }
        return this.renderField(args);
    }

    renderToggle = (param) => {
        let parameterValue = utils.locateNestedParameterValue(this.props.parameters, param),
            parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param),
            props = generateFieldProps(parameterValue, parameterInfo, false),
            items = [
                <MenuItem key={`toggle-field-${param}-1`} value={true}  primaryText="True"/>,
                <MenuItem key={`toggle-field-${param}-2`} value={false}  primaryText="False"/>
            ];
        let args = {
            param: param,
            parameterValue: parameterValue,
            parameterInfo: parameterInfo,
            node: (
                <SelectField
                  onChange={(event, index, value) => { this.props.setToggle(param, value)}}
                  {...style.SelectFieldToggleStyle}
                  {...props}
                >
                  {items}
                </SelectField>
            )
        }
        return this.renderField(args);
    }

    renderFunctionEditor = (param) => {
        let parameterValue = utils.locateNestedParameterValue(this.props.parameters, param),
            parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
        let args = {
            param: param,
            parameterInfo: parameterInfo,
            parameterValue: parameterValue,
            node: <CommonComponents.Undefined />,
            forceCustomFloatingLabel: true,
            autoConvertToArrayComponent: false,
            onlyFunction: true,
        }   
        return this.renderField(args);
    }

    renderKeyboardInput = (param) => {

        let parameterValue = utils.deepCopy(utils.locateNestedParameterValue(this.props.parameters, param)),
            parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);

        let node = (
            <KeyboardSelector
                value={parameterValue.value}
                onCommit={(value) => { this.props.setKey(param, value); }}
                parameterName={parameterInfo.pretty_name}
                Trigger={({label='Key Choices', onClick}) => (
                    CommonComponents.Triggers.KeyboardSelector({label: label, onClick: onClick})
                )}
                multiSelect={parameterInfo.array}
            />
        )

        let args = {
            param: param,
            parameterValue: parameterValue,
            parameterInfo: parameterInfo,
            node: node,
            autoConvertToArrayComponent: false,
            forceCustomFloatingLabel: true
        }

        return this.renderField(args);
    }

    renderSelect = (param) => {
        let parameterValue = utils.locateNestedParameterValue(this.props.parameters, param),
            parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param),
            props = generateFieldProps(parameterValue, parameterInfo, false);
        let args = {
            param: param,
            parameterValue: parameterValue,
            parameterInfo: parameterInfo,
            node: (
                <SelectField
                    multiple={!!parameterInfo.array}
                    id={this.props.id+"-select-field-"+param}
                    onChange={(event, index, value) => {
                        this.props.setText(param, value);
                    }}
                    {...style.SelectFieldStyle}
                    {...props}
                >
                    {
                        parameterInfo.options && parameterInfo.options.map((op, i) => (
                            <MenuItem value={op} primaryText={op} key={op+"-"+i}/>
                        ))
                    }
                </SelectField>
            )
        }
        return this.renderField(args);
    }

    renderMediaSelector = (param) => {

        let parameterValue = utils.locateNestedParameterValue(this.props.parameters, param),
            parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param),
            multiSelect = !!parameterInfo.array,
            val = parameterValue && parameterValue.value;

        let f = s => s && s.replace('<path>', '').replace('</path>', '');
        // selected files, displayed label
        let selected, label;
        if (Array.isArray(val)) {
            selected = val && val.map(l => f(l));
        } else {
            selected = val ? [f(val)] : [];
        }
        if (selected && selected.length > 0) {
            // show ... if more than 1 files
            label = `${selected[0]} ${selected.length > 1 ? ' ...' : ''}`;
        } else {
            // if none, prompt user to select media
            label = 'Select Media';
        }

        let args = {
            param: param,
            parameterValue: parameterValue,
            parameterInfo: parameterInfo,
            node: (
                <MediaManager 
                    Trigger_insert={({onClick}) => (CommonComponents.Triggers.MediaSelector({label: label, onClick: onClick}))}
                    parameterName={param} 
                    selected={selected}
                    mode={(!multiSelect) ? enums.MediaManagerMode.select : enums.MediaManagerMode.multiSelect}
                    onCommit={(value) => {
                        this.props.insertFile(
                            param,
                            value
                        );
                    }}
                />
            ),
            forceCustomFloatingLabel: true,
            autoConvertToArrayComponent: false
        };
        return this.renderField(args);
    }

    renderObjectEditor = (param) => {
        let parameterValue = utils.locateNestedParameterValue(this.props.parameters, param),
            parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
        let args = {
            param: param,
            parameterInfo: parameterInfo,
            parameterValue: parameterValue,
            node: (
                <ObjectEditor
                    Trigger={CommonComponents.Triggers.ObjectEditor}
                    value={parameterValue.value}
                    title={`${parameterInfo.pretty_name}: `}
                    keyName={param}
                    onCommit={(obj) => { this.props.setObject(param, obj); }}
                />
            ),
            forceCustomFloatingLabel: true,
            autoConvertToArrayComponent: false
        }   
        return this.renderField(args);
    }

    renderComplex = (param) => {

        /*
        parameterValue = {
            value: [], // must be array
        }
        */
        let parameterValue = utils.locateNestedParameterValue(this.props.parameters, param);
        let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
        let expandToggle = (
            <IconButton
                tooltip={(this.state.subFormCollapse) ? "Expand" : "Collapse"}
                onClick={this.toggleSubFormCollapse}
            >
                {
                    (this.state.subFormCollapse) ? 
                        <CollapseIcon {...style.ComplexField.expandIcon} /> :
                        <ExpandIcon {...style.ComplexField.expandIcon} />
                }
            </IconButton>
        )

        let children = (
            <div style={{...style.ComplexField.children.root}}>
                {
                    Array.isArray(parameterValue.value) && parameterValue.value.map((p, i) => {
                        let items = Object.keys(parameterInfo.nested) && Object.keys(parameterInfo.nested).map((key, j) => {
                            let newParam = utils.deepCopy(param);
                            if (typeof newParam !== 'object') {
                                newParam = new PathNode(newParam);
                            }
                            let cur = newParam;
                            while (cur.next) cur = cur.next;
                            cur.next = new PathNode(key, i);
                            return <TrialFormItemContainer 
                                        key={`${this.props.param}-${key}-${j}`}
                                        param={cur}
                                        paramInfo={this.props.paramInfo}
                                    />
                        });

                        return (
                            <div 
                                key={`complex-jsPysch-trial-item-container-${i}`} 
                                style={{
                                    ...style.ComplexField.children.sheet.root(i%2 === 0),
                                }}
                                >
                                <div 
                                    style={{ ...style.ComplexField.children.sheet.CloseButtonContainer}}
                                    key={`complex-jsPysch-trial-item-delete-conainer-${i}`} 
                                >
                                    <IconButton  
                                        key={`complex-jsPysch-trial-item-delete-${i}`} 
                                        onClick={() => {this.props.depopulateComplex(param, i)}}
                                        {...style.ComplexField.children.sheet.CLoseButton}
                                    >
                                        <DeleteSubItemIcon />
                                    </IconButton>
                                </div>
                                {items}
                            </div>
                        )

                    })
                }
                <div style={{...style.ComplexField.addChildrenButtonContainer}}>
                    <FlatButton
                        {...style.ComplexField.addChildrenButton}
                        onClick={() => {this.props.populateComplex(param, parameterInfo.nested)}}
                    />
                </div>
            </div>
        )

        let args = {
            param: param,
            parameterInfo: parameterInfo,
            parameterValue: parameterValue,
            forceCustomFloatingLabel: true,
            autoConvertToArrayComponent: false,
            node: expandToggle
        }

        let useFunc = parameterValue.mode === enums.ParameterMode.USE_FUNC,
            useTV = parameterValue.mode === enums.ParameterMode.USE_TV;
        return (
            <React.Fragment> 
                {this.renderField(args)} 
                {(this.state.subFormCollapse || useFunc || useTV) ? null : children}
            </React.Fragment>
        )
    }

    renderItem = (param) => {
        let parameterInfo = locateNestedParameterInfo(this.props.paramInfo, param);
        let parameterValue = utils.locateNestedParameterValue(this.props.parameters, param);
        // current plugin is outdated
        if (!parameterValue) {
            return null;
        }
        switch(parameterInfo.type) {
                case EnumPluginType.AUDIO:
                case EnumPluginType.IMAGE:
                case EnumPluginType.VIDEO:
                    return this.renderMediaSelector(param);
                case EnumPluginType.BOOL:
                    return this.renderToggle(param);
                case EnumPluginType.INT:
                case EnumPluginType.FLOAT:
                    return this.renderNumberField(param);
                case EnumPluginType.FUNCTION:
                    return this.renderFunctionEditor(param);
                // same different
                case EnumPluginType.SELECT:
                    return this.renderSelect(param);
                case EnumPluginType.KEYCODE:
                    return this.renderKeyboardInput(param);
                case EnumPluginType.OBJECT:
                    return this.renderObjectEditor(param);
                case EnumPluginType.COMPLEX:
                    return this.renderComplex(param);
                case EnumPluginType.HTML_STRING:
                case EnumPluginType.STRING:
                default:
                    return this.renderTextField(param);
        }
    }

    render() {
        return (
            this.renderItem(this.props.param)
        )
    }
}