import React from 'react';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import { useForm } from '@fuse/hooks';
import OrderlistModel from 'app/main/apps/scrumboard/model/OrderlistModel';

function CardAddOrderlistItem(props)
{
    const { disabled } = props

    const {form, handleChange, handleCustomChange, resetForm} = useForm(
        {
            code: '',
            name: '',
            qty: '',
            price: ''
        }
    );

    function isFormInValid()
    {
        return form.code === '' ||
            form.name === '' ||
            form.qty === '' ||
            form.price === '' ||
            parseFloat(form.qty) < 0 ||
            parseFloat(form.price) < 0 ||
            !Number.isInteger(parseFloat(form.qty))
    }

    function handleSubmit()
    {
        if ( isFormInValid() )
        {
            return;
        }
        props.onOrderItemAdd(new OrderlistModel(form));
        resetForm();
    }

    return (
        <tr>
            <td></td>
            <td>
                <TextField
                    className="flex flex-1 mx-8"
                    name="code"
                    margin="dense"
                    value={form.code}
                    onKeyUp={e => e.which === 13 && handleSubmit()}
                    onChange={handleChange}
                    disabled={disabled}
                    variant="outlined"
                />
            </td>
            <td>
                <TextField
                    className="flex flex-1 mx-8"
                    name="name"
                    margin="dense"
                    value={form.name}
                    onKeyUp={e => e.which === 13 && handleSubmit()}
                    onChange={handleChange}
                    disabled={disabled}
                    variant="outlined"
                />
            </td>
            <td>
                <TextField
                    className="flex flex-1 mx-8"
                    name="qty"
                    margin="dense"
                    value={form.qty}
                    onChange={handleCustomChange(e => parseInt(e.target.value))}
                    onKeyUp={e => e.which === 13 && handleSubmit()}
                    inputProps={{type: 'number', min: 0}}
                    disabled={disabled}
                    variant="outlined"
                />
            </td>
            <td>
                <TextField
                    className="flex flex-1 mx-8"
                    name="price"
                    margin="dense"
                    value={form.price}
                    onChange={handleChange}
                    onKeyUp={e => e.which === 13 && handleSubmit()}
                    inputProps={{type: 'number', min: 0}}
                    disabled={disabled}
                    variant="outlined"
                />
            </td>
            <td>
                <TextField
                    className="flex flex-1 mx-8"
                    name="tot"
                    margin="dense"
                    value={Math.round(form.price * form.qty * 100) / 100}
                    disabled={disabled}
                    variant="outlined"
                />
            </td>
            <td className='text-center'>
                <Fab
                    aria-label="Add"
                    size="small"
                    color="secondary"
                    onClick={handleSubmit}
                    disabled={disabled || isFormInValid()}
                >
                    <Icon>add</Icon>
                </Fab>
            </td>
        </tr>
    );
}

export default CardAddOrderlistItem;
