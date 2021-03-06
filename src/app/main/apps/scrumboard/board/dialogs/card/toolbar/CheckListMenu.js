import React, {useEffect, useState} from 'react';
import {Icon, IconButton, Button, TextField, MenuItem} from '@material-ui/core';
import {useForm} from '@fuse/hooks';
import ToolbarMenu from './ToolbarMenu';
import ChecklistModel from 'app/main/apps/scrumboard/model/ChecklistModel';

function CheckListMenu(props)
{
    const [anchorEl, setAnchorEl] = useState(null);
    const {form, resetForm} = useForm({
        name: 'Checklist'
    });

    useEffect(() => {
        if ( !anchorEl )
        {
            resetForm();
        }
    }, [anchorEl, resetForm]);

    function handleMenuOpen(event)
    {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose()
    {
        setAnchorEl(null);
    }

    function isFormInvalid()
    {
        return form.name === '';
    }

    function handleSubmit(ev)
    {
        ev.preventDefault();
        handleMenuClose();
        if ( isFormInvalid() )
        {
            return;
        }
        props.onSetCheckList();
    }

    return (
        <div>
            <IconButton color="inherit" onClick={handleMenuOpen}>
                <Icon>check_box</Icon>
            </IconButton>
            {anchorEl && 
                <ToolbarMenu state={anchorEl} onClose={handleMenuClose}>
                    {props.checklistAdded ? (
                        <MenuItem onClick={e => {
                            handleMenuClose();
                            props.onRemoveCheckList();
                        }}>
                            Remove checklist
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={handleSubmit}>
                            Add checklist
                        </MenuItem>
                        // <form onSubmit={handleSubmit} className="p-16 flex flex-col items-end">
                        //     <TextField
                        //         label="Checklist title"
                        //         name="name"
                        //         value={form.name}
                        //         onChange={                        //         fullWidth
                        //         className="mb-12"
                        //         variant="outlined"
                        //         required
                        //         autoFocus
                        //     />
                        //     <Button
                        //         color="secondary"
                        //         type="submit"
                        //         disabled={isFormInvalid()}
                        //         variant="contained"
                        //     >
                        //         Add
                        //     </Button>
                        // </form>
                    )}
                </ToolbarMenu>
            }
        </div>
    );
}

export default CheckListMenu;
