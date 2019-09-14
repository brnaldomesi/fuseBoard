import {Icon, IconButton, TextField, Checkbox, ListItem} from '@material-ui/core';
import React from 'react';
import {useForm, useUpdateEffect} from '@fuse/hooks';

function CardChecklistItem(props)
{
    const {item, onListItemChange, index, disabled} = props;
    const {form, handleChange} = useForm(item);

    useUpdateEffect(() => {
        onListItemChange(form, index);
    }, [form, index, onListItemChange]);

    if ( !form )
    {
        return null;
    }

    return (
        <ListItem
            className="px-0"
            key={form.id}
            dense
        >
            <Checkbox
                checked={form.checked}
                name="checked"
                onChange={handleChange}
                disabled={disabled}
                tabIndex={-1}
            />
            <TextField
                className="flex flex-1 mx-8"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={disabled}
                variant="outlined"
            />
            <IconButton
                aria-label="Delete"
                onClick={props.onListItemRemove}
                disabled={disabled}
            >
                <Icon>delete</Icon>
            </IconButton>
        </ListItem>
    );
}

export default CardChecklistItem;
