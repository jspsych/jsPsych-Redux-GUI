import React from 'react';
import { render } from 'react-dom';

const addTrial = (list) => {
    // ES6 notation for "list.concat(0)"
    return [...list, 0];
}

const removeTrial = (list, index) => {
    // ES6 notation for "list.slice(0, index).concat(list.slice(index + 1 ))"
    // i.e. Slice the section of the list from before index and concat it 
    // to the section after index
    return [
        ...list.slice(0, index),
        ...list.slice(index + 1)
    ];
};


class TimelineStructure extends React.Component {
    constructor(props) {
        // console.log("Construct Timeline Structure");
        super(props);
        this.state = {
            value: null,
            open: false,
            add: false,
            reset: false,
            trial_name: "",
            //   items: [],
            currentTrialType: "video",
            selectedIndex: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleClick = (e) => {
        // console.log("click", e);
    }
    // Handle state when a trial is clicked on
    handleTouchTap = (item, event) => {
        var event_data = event;
        console.log("Handle Touch Tap item", item);
        this.setState({
            open: true,
            trial_name: item.name,
            selectedIndex: item.key
        })
        var {dispatch} = this.props;
        //console.log("Trial Name: ", trial_name);
        dispatch(setClickedTimelineItem(item.key));
        //dispatch(setClickedTimelineName(item.name));
    }

    handleTouchTapAdd = (event) => {
        var event_data = event;
        //console.log(event_data.target);
        //console.log(event_data.target.innerHTML);
        var trial_name = event_data.target.innerHTML;
        this.setState({
            add: true,
            reset: false,
            trial_name: trial_name
        });

        event_data.preventDefault();
        var newTimeline = this.props.state.timelineStructure;

        var trial = {
            key: newTimeline.length,
            name: "newTrial",
            children: [],
            type: "trial",
            pluginType: '',
            pluginData: [],
            errors: {}
        };

        var {dispatch} = this.props;
        dispatch(setTimelineStructure(newTimeline.slice(0).concat(trial)));
        dispatch(setClickedTimelineItem(newTimeline.length - 1));
        dispatch(loadPlugins(items));
        // this.props.onSumbit({ TRIAL_TEMPLATE });
    }
    closeDrawer = (event) => {
        //console.log("In close drawer");
        this.setState({ open: false });
    }
    closeAdd = (event) => {
        //console.log("In close add");
        this.setState({
            add: false,
            reset: true
        });
        trialViewApp(state);
        this.setState({
            reset: false,
        })
    }
    handleSubmit = (event) => {
        event.preventDefault();

    }
    handleChange = (event, index, value) => {

        var curIndex = this.props.state.selectedTimelineItem;
        var curItem = this.props.state.timelineStructure[curIndex];

        var {pluginDetails} = this.props.state;
        var newTrialType = [];
        var value_plugin_parameters = [];
        if (curItem.pluginType === "") {
            console.log("handleChange TimelineData", curIndex);
            for (var i = 0; i < pluginDetails.length; i++) {
                if (pluginDetails[i].name == value) {
                    newTrialType = pluginDetails[i].parameters;
                    break;
                }
            }
            Object.assign(curItem, { pluginData: newTrialType, pluginType: value });
            var {dispatch} = this.props;
            dispatch(updateTimelineItem(curItem));
            this.setState({ value: value, currentTrialType: newTrialType });
        } else {
            console.log("HandleChange Else")
            for (var i = 0; i < pluginDetails.length; i++) {
                if (pluginDetails[i].name === curItem.pluginType) {
                    newTrialType = pluginDetails[i].parameters;
                    break;
                }
            }
            this.setState({ value: value, currentTrialType: newTrialType });
        }


    }
    render = () => {
        var self = this;
        var {trial_name} = this.state;
        Object.assign(state, this.props);
        return (
            <div>
                <Paper className="stylePaper" style={paperStyle} zDepth={1}>
                    <SelectableList defaultValue={1}>
                        <Subheader>Experiment Timeline</Subheader>
                        {timelineStructure.map(function (item) {
                            valueCount = valueCount + 1;
                            return (
                                <ListItem
                                    primaryText={item.name}
                                    value={valueCount}
                                    leftAvatar={<Avatar>T</Avatar>}
                                    onTouchTap={self.handleTouchTap.bind(self, item)}
                                    key={valueCount} />
                            )
                        })
                        }
                    </SelectableList>
                    <FloatingActionButton style={styleFAB} onTouchTap={self.handleTouchTapAdd}>
                        <ContentAdd />
                    </FloatingActionButton>
                </Paper>
                <Drawer width={400} openSecondary={true} open={this.state.open} >
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <IconButton onTouchTap={this.closeDrawer} tooltip="Close"><NavigationClose /></IconButton>
                            <ToolbarTitle text={trial_name} />
                        </ToolbarGroup>
                    </Toolbar>
                    <br />
                    <div>
                        {showTimelineForm(this.state)}
                    </div>
                </Drawer>
            </div>
        );
    }
};