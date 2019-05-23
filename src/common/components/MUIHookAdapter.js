import { makeStyles, useTheme } from '@material-ui/core/styles';

export default function MUIHookAdapter(
    {classes=makeStyles(), theme=useTheme()}, Component
    ) {
    return (props) => (<Component classes={classes} theme={theme} {...props} />);
}