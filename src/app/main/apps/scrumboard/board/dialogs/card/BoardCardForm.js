import * as Actions from 'app/main/apps/scrumboard/store/actions/index';

import React, {useCallback} from 'react';
import {useDebounce, useForm} from '@fuse/hooks';
import {useDispatch, useSelector} from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import AttachmentMenu from './toolbar/AttachmentMenu';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardActivity from './activity/CardActivity';
import CardAttachment from './attachment/CardAttachment';
import CardChecklist from './checklist/CardChecklist';
import CardComment from './comment/CardComment';
import CardOrderlist from './orderlist/CardOrderlist';
import CheckListMenu from './toolbar/CheckListMenu';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DueMenu from './toolbar/DueMenu';
import {FuseChipSelect} from '@fuse';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import {KeyboardDatePicker} from "@material-ui/pickers";
import LabelModel from 'app/main/apps/scrumboard/model/LabelModel';
import LabelsMenu from './toolbar/LabelsMenu';
import List from '@material-ui/core/List';
import MembersMenu from './toolbar/MembersMenu';
import OptionsMenu from './toolbar/OptionsMenu';
import OrderListMenu from './toolbar/OrderListMenu';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';
import clsx from 'clsx';
import { getUserId } from 'app/auth';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    saveButton: {
        margin: '1em',
        marginLeft: 0
    },
    datePicker: {
        '& .MuiFormHelperText-root': {
            display: 'none'
        }
    },
    readAllEdit: {
      right: theme.spacing(1),
      bottom: theme.spacing(1)
    }
}));

function BoardCardForm(props)
{
    const dispatch = useDispatch();
    const card = useSelector(({scrumboardApp}) => scrumboardApp.card.data);
    const board = useSelector(({scrumboardApp}) => scrumboardApp.board);
    const locked = card && card.lock && card.lock._id && card.lock._id !== getUserId();

    const {form: cardForm, handleChange, setForm, setInForm} = useForm(card);
    const updateCard = useDebounce( (card, changes) => {
        dispatch(Actions.updateCard({...card}), changes);
    }, 0);

    const dueDate = cardForm && cardForm.due ? moment(cardForm.due).toDate() : null;
    const classes = useStyles();

    function difference(oldCard, newCard) {
      const changes = {};
      if(oldCard.name !== newCard.name) {
        changes.title = newCard.name
      }
      if(oldCard.due !== newCard.due) {
        changes.due_date = newCard.due
      }
      if(oldCard.description !== newCard.description) {
        changes.description = newCard.description
      }
      if(JSON.stringify(oldCard.idMembers) !== JSON.stringify(newCard.idMembers)) {
        changes.members = [];
        oldCard.idMembers.forEach(idMember => {
          if(!newCard.idMembers.includes(idMember)) {
            const selectedMember = _.find(board.members, {id: idMember});
            const removedMember = {
              id: idMember,
              name: selectedMember.name,
              action: 'remove'
            }
            changes.members.push(removedMember)
          }
        })
        newCard.idMembers.forEach(idMember => {
          if(!oldCard.idMembers.includes(idMember)) {
            const selectedMember = _.find(board.members, {id: idMember});
            const addedMember = {
              id: idMember,
              name: selectedMember.name,
              action: 'add'
            }
            changes.members.push(addedMember)
          }
        })
      }
      if(JSON.stringify(oldCard.idLabels) !== JSON.stringify(newCard.idLabels)) {
        changes.labels = [];
        oldCard.idLabels.forEach(idLabel => {
          if(!newCard.idLabels.includes(idLabel)) {
            const selectedLabel = _.find(board.labels, {id: idLabel});
            const removedLabel = {
              id: idLabel,
              name: selectedLabel.name,
              action: 'remove'
            }
            changes.labels.push(removedLabel)
          }
        })
        newCard.idLabels.forEach(idLabel => {
          if(!oldCard.idLabels.includes(idLabel)) {
            const selectedLabel = _.find(board.labels, {id: idLabel});
            const addedLabel = {
              id: idLabel,
              name: selectedLabel.name,
              action: 'add'
            }
            changes.labels.push(addedLabel)
          }
        })
      }
      if(JSON.stringify(oldCard.attachments) !== JSON.stringify(newCard.attachments)) {
        changes.attachments = [];
        oldCard.attachments.forEach(attachment => {
          if(!newCard.attachments.includes(attachment)) {
            const removedAttachment = {
              id: attachment.id,
              name: attachment.name,
              action: 'remove'
            }
            changes.attachments.push(removedAttachment)
          }
        })
        newCard.attachments.forEach(attachment => {
          if(!oldCard.attachments.includes(attachment)) {
            const addedAttachment = {
              id: attachment.id,
              name: attachment.name,
              action: 'add'
            }
            changes.attachments.push(addedAttachment)
          }
        })
      }
      if(JSON.stringify(oldCard.activities) !== JSON.stringify(newCard.activities)) {
        changes.activities = [];
        oldCard.activities.forEach(activity => {
          if(!newCard.activities.includes(activity)) {
            const removedActivity = {
              id: activity.id,
              name: activity.message,
              action: 'remove'
            }
            changes.activities.push(removedActivity)
          }
        })
        newCard.activities.forEach(activity => {
          if(!oldCard.activities.includes(activity)) {
            const addedActivity = {
              id: activity.id,
              name: activity.message,
              action: 'add'
            }
            changes.activities.push(addedActivity)
          }
        })
      }
      if(oldCard.orderlists) {
        if(JSON.stringify(oldCard.orderlists) !== JSON.stringify(newCard.orderlists)) {
          changes.orders = [];
          oldCard.orderlists.forEach(order => {
            if(!newCard.orderlists.includes(order)) {
              const removedOrder = {
                id: order.id,
                name: order.name,
                action: 'remove'
              }
              changes.orders.push(removedOrder)
            }
          })
          newCard.orderlists.forEach(order => {
            if(!oldCard.orderlists.includes(order)) {
              const addedOrder = {
                id: order.id,
                name: order.name,
                action: 'add'
              }
              changes.orders.push(addedOrder)
            }
          })
        }
      }
      
      return changes;
    }

    function handleSaveClick()
    {
        if (dueDate && isNaN(dueDate.valueOf())) {
            return;
        }

        const due = dueDate ? dueDate.toISOString().slice(0, 10) : ""
        const e = { target: { name: 'due', type: 'date', value: due } };
        handleChange(e);
        const changes = difference(card, cardForm)
        updateCard(cardForm, changes);
    }

    function removeDue()
    {
        setInForm('due', null);
    }

    function toggleLabel(labelId)
    {
        setInForm('idLabels', _.xor(cardForm.idLabels, [labelId]));
    }

    function toggleMember(memberId)
    {
        setInForm('idMembers', _.xor(cardForm.idMembers, [memberId]));
    }

    function setCheckList()
    {
        setInForm('checklists', []);
    }

    function toggleOrderList(show)
    {
        setInForm('orderlists', show ? [] : null);
    }

    function chipChange(name, value)
    {
        setInForm(name, value.map(item => item.value));
    }

    function addNewChip(name, value)
    {
        setInForm(name, [...cardForm[name], value]);
    }

    function makeCover(attachmentId)
    {
        setInForm('idAttachmentCover', attachmentId);
    }

    function removeCover()
    {
        setInForm('idAttachmentCover', '');
    }

    function removeAttachment(attachmentId)
    {
        setForm({
            ...cardForm,
            attachments      : _.reject(cardForm.attachments, {id: attachmentId}),
            idAttachmentCover: cardForm.idAttachmentCover === attachmentId ? '' : cardForm.idAttachmentCover
        });
    }

    const handleCheckListChange = useCallback(checklists => {
        setInForm('checklists', checklists);
    }, [setInForm]);

    const handleOrderListChange = useCallback(orderlists => {
        setInForm('orderlists', orderlists);
    }, [setInForm]);

    function removeCheckList(id)
    {
        if (id) {
            setInForm('checklists', _.reject(cardForm.checklists, { id }));
        } else {
            setInForm('checklists', null);
        }
    }

    function commentAdd(comment)
    {
        return setInForm('activities', [comment, ...cardForm.activities]);
    }

    function handleAttachUpload(attachment)
    {
        const date = new Date();
        const time = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const updatedAttachments = cardForm.attachments.concat({ ...attachment, time })
        let idAttachmentCover = null;

        if (!cardForm.idAttachmentCover) {
            const coverImage = _.find(updatedAttachments, ({ type }) => type.indexOf('image') >= 0);
            if (coverImage) {
                idAttachmentCover = coverImage.id;
            }
        }
        
        setForm({
            ...cardForm,
            idAttachmentCover: idAttachmentCover,
            attachments: updatedAttachments
        })
    }

    return (
        <>
            <DialogTitle component="div" className="p-0">
                <AppBar position="static" elevation={1}>
                    <Toolbar className="flex w-full overflow-x-auto px-8 sm:px-16 justify-between">
                        {locked ? (
                            <div className="flex flex-1 items-center">
                                <Button
                                    variant='contained'
                                    onClick={handleSaveClick}
                                    className={classes.saveButton}    
                                >
                                    Save
                                </Button>
                                <Icon>lock</Icon>
                            </div>
                        ) : card === null ? <div></div> : (
                            <div className="flex flex-1 items-center">
                                <Button
                                    variant='contained'
                                    onClick={handleSaveClick}
                                    className={classes.saveButton}    
                                >
                                    Save
                                </Button>
                                <DueMenu
                                    onDueChange={handleChange}
                                    onRemoveDue={removeDue}
                                    due={dueDate}
                                />

                                {board.labels && board.labels.length > 0 && (
                                    <LabelsMenu
                                        onToggleLabel={toggleLabel}
                                        labels={board.labels}
                                        idLabels={cardForm.idLabels}
                                    />
                                )}

                                <MembersMenu
                                    onToggleMember={toggleMember}
                                    members={board.members}
                                    idMembers={cardForm.idMembers}
                                />
        
                                <OrderListMenu
                                    orderlist={cardForm.orderlists}
                                    onToggleOrderlist={toggleOrderList}
                                />

                                <AttachmentMenu
                                    cardId={cardForm.id}
                                    onUpload={handleAttachUpload}
                                />
                                
                                <IconButton color="inherit">
                                  <Icon>access_time</Icon>
                                </IconButton>

                                <CheckListMenu
                                    checklistAdded={!!cardForm.checklists}
                                    onSetCheckList={setCheckList}
                                    onRemoveCheckList={removeCheckList}
                                />

                                <OptionsMenu
                                    onRemoveCard={() => dispatch(Actions.removeCard(cardForm.id))}
                                />

                            </div>
                        )}
                        <IconButton color="inherit">
                            <Icon>remove_red_eye</Icon>
                        </IconButton>
                        <IconButton color="inherit">
                            <Icon>info</Icon>
                        </IconButton>
                        <IconButton color="inherit" onClick={ev => dispatch(Actions.closeCardDialog(card, locked))}>
                            <Icon>close</Icon>
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </DialogTitle>

            <DialogContent className="p-16 sm:p-24">
                <div className="flex flex-col sm:flex-row sm:justify-between justify-center items-center mb-24">
                    <div className="mb-16 sm:mb-0 flex items-center">
                        <Typography>{board.name}</Typography>
                        <Icon className="text-20" color="inherit">chevron_right</Icon>
                        {React.useMemo(() => {
                            const list = card ? _.find(board.lists, (_list) => _list.idCards.includes(card.id)) : null;

                            return (
                                <Typography>{list && list.name}</Typography>
                            )
                        }, [board, card])}
                    </div>
                    
                    <Button variant='contained'>Assign to ...</Button>

                    {cardForm.due && (
                        <KeyboardDatePicker
                            ampm={false}
                            label="Due date"
                            inputVariant="outlined"
                            onChange={v => {
                                const e = { target: { name: 'due', type: 'date', value: v } };
                                handleChange(e);
                            }}
                            invalidDateMessage={<></>}
                            className={classes.datePicker}
                            value={dueDate}
                            disabled={locked}
                            showTodayButton
                            format="dd/MM/yyyy"
                        />
                    )}
                </div>

                <div className="flex items-center mb-24">
                    <TextField
                        label="Title"
                        type="text"
                        name="name"
                        value={cardForm.name}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        disabled={locked}
                        required
                        // InputProps={{
                        //     endAdornment: (
                        //         <InputAdornment position="end">
                        //             {cardForm.subscribed && (
                        //                 <Icon className="text-20" color="action">remove_red_eye</Icon>
                        //             )}
                        //         </InputAdornment>
                        //     )
                        // }}
                    />
                </div>

                <div className="w-full mb-24 relative">
                    <TextField
                        label="Description"
                        name="description"
                        multiline
                        rows="4"
                        value={cardForm.description}
                        onChange={handleChange}
                        disabled={locked}
                        variant="outlined"
                        fullWidth
                    >
                    </TextField>
                    <Button variant='contained' className={clsx('absolute', classes.readAllEdit)}>Read All / Edit</Button>
                </div>

                <div className="flex flex-col sm:flex-row">
                    {cardForm.idLabels.length > 0 && (
                        <div className="flex-1 mb-24">
                            <div className="flex items-center mt-16 mb-12">
                                <Icon className="text-20 mr-8" color="inherit">label</Icon>
                                <Typography className="font-600 text-16">Labels</Typography>
                            </div>
                            <FuseChipSelect
                                className={cardForm.idMembers.length > 0 && 'sm:mr-8'}
                                value={
                                    cardForm.idLabels.map(labelId => {
                                        const label = _.find(board.labels, {id: labelId});
                                        return label && {
                                            value: labelId,
                                            label: label.name,
                                            class: label.class
                                        }
                                    })
                                }
                                onChange={(value) => chipChange('idLabels', value)}
                                placeholder="Select multiple Labels"
                                isMulti
                                isDisabled={locked}
                                textFieldProps={{
                                    variant: "outlined"
                                }}
                                options={board.labels.map((label) => ({
                                    value: label.id,
                                    label: label.name,
                                    class: label.class
                                }))}
                                onCreateOption={(name) => {
                                    // Create New Label
                                    const newLabel = new LabelModel({name});

                                    // Ad new Label to board(redux store and server)
                                    dispatch(Actions.addLabel(newLabel));

                                    // Trigger handle chip change
                                    addNewChip('idLabels', newLabel.id);

                                    return newLabel.id;
                                }}
                            />
                        </div>
                    )}

                    {cardForm.idMembers.length > 0 && (
                        <div className="flex-1 mb-24">
                            <div className="flex items-center mt-16 mb-12">
                                <Icon className="text-20 mr-8" color="inherit">supervisor_account</Icon>
                                <Typography className="font-600 text-16">Members</Typography>
                            </div>
                            <FuseChipSelect
                                className={cardForm.idLabels.length > 0 && 'sm:ml-8'}
                                value={
                                    cardForm.idMembers.map(memberId => {
                                        const member = _.find(board.members, {id: memberId});
                                        return member && {
                                            value: member.id,
                                            label: (<Tooltip title={member.name}><Avatar className="-ml-12 w-32 h-32" src={member.avatar}/></Tooltip>)
                                        }
                                    })
                                }
                                onChange={(value) => chipChange('idMembers', value)}
                                placeholder="Select multiple Members"
                                isMulti
                                isDisabled={locked}
                                textFieldProps={{
                                    variant: "outlined"
                                }}
                                options={board.members.map((member) => ({
                                    value: member.id,
                                    /* label: (
                                        <span className="flex items-center">
                                            <Avatar className="w-32 h-32 mr-8" src={member.avatar}/>
                                            {member.name}
                                        </span>
                                    ) */
                                    label: member.name
                                }))}
                                variant="fixed"
                            />
                        </div>
                    )}
                </div>

                {!!cardForm.orderlists && (
                    <CardOrderlist
                        disabled={locked}
                        orderlist={cardForm.orderlists}
                        onOrderListChange={handleOrderListChange}
                    />
                )}

                {cardForm.attachments.length > 0 && (
                    <div className="mb-24">
                        <div className="flex items-center mt-16 mb-12">
                            <Icon className="text-20 mr-8" color="inherit">attachment</Icon>
                            <Typography className="font-600 text-16">Attachments</Typography>
                        </div>
                        <div className="flex flex-col sm:flex-row flex-wrap">
                            {cardForm.attachments.map(item => (
                                <CardAttachment
                                    item={item}
                                    disabled={locked}
                                    cover={cardForm.idAttachmentCover}
                                    makeCover={makeCover}
                                    removeCover={removeCover}
                                    removeAttachment={removeAttachment}
                                    key={item.id}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {!!cardForm.checklists && (
                    <CardChecklist
                        disabled={locked}
                        checklist={cardForm.checklists}
                        onCheckListChange={handleCheckListChange}
                        onRemoveCheckList={removeCheckList}
                    />
                )}

                <div className="mb-24">
                    <div className="flex items-center mt-16 mb-12">
                        <Icon className="text-20 mr-8" color="inherit">comment</Icon>
                        <Typography className="font-600 text-16">Comment</Typography>
                    </div>
                    <div>
                        <CardComment
                            members={board.members}
                            onCommentAdd={commentAdd}
                        />
                    </div>
                </div>

                {cardForm.activities.length > 0 && (
                    <div className="mb-24">
                        <div className="flex items-center mt-16">
                            <Icon className="text-20 mr-8" color="inherit">list</Icon>
                            <Typography className="font-600 text-16">Activity</Typography>
                        </div>
                        <List className="">
                            {cardForm.activities.map(item => (
                                    <CardActivity
                                        item={item}
                                        key={item.id}
                                        members={board.members}
                                    />
                                )
                            )}
                        </List>
                    </div>
                )}
            </DialogContent>
        </>
    );
}

export default BoardCardForm;
