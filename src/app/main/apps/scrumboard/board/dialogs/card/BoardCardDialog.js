import React from 'react';
import {Dialog} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from 'app/main/apps/scrumboard/store/actions';
import clsx from 'clsx';
import BoardCardForm from './BoardCardForm';
import { getUserId } from 'app/auth';


const useStyles = makeStyles(theme => ({
    paper: {
        color: theme.palette.text.primary
    }
}));

function BoardCardDialog(props)
{
    const dispatch = useDispatch();
    const cardDialogOpen = useSelector(({scrumboardApp}) => scrumboardApp.card.dialogOpen);
    const card = useSelector(({scrumboardApp}) => scrumboardApp.card.data);
    const locked = card && card.lock && card.lock._id && card.lock._id !== getUserId();


    const classes = useStyles(props);

    return (
        <Dialog
            classes={{
                paper: clsx(classes.paper, "max-w-lg w-full m-24")
            }}
            onClose={ev => dispatch(Actions.closeCardDialog(card, locked))}
            open={cardDialogOpen}
        >
            <BoardCardForm/>
        </Dialog>
    );
}

export default BoardCardDialog;
