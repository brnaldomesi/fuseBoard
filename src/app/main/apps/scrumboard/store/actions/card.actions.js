import axios from 'axios';
import _ from '@lodash';
import {showMessage} from 'app/store/actions/fuse';

export const OPEN_CARD_DIALOG = '[SCRUMBOARD APP] OPEN CARD DIALOG';
export const CLOSE_CARD_DIALOG = '[SCRUMBOARD APP] CLOSE CARD DIALOG';
export const UPDATE_CARD = '[SCRUMBOARD APP] UPDATE CARD';
export const REMOVE_CARD = '[SCRUMBOARD APP] REMOVE CARD';


function lockRequest(lock, card, dispatch)
{
    const request = axios.post('/api/card/lock', {
        id_card: card.id,
        locked: lock
    });

    return request.then(
        response => ({ ...card, lock: response.data.locked ? { ...card.lock, _id: response.data.locked } : undefined }),
        error => ({ ...card, lock: { ...card.lock, _id: error.response.data.locked } })
    ).then(newCard => {
        dispatch({
            type: UPDATE_CARD,
            payload: newCard
        })
        return newCard
    })
}

export function openCardDialog(data)
{
    return dispatch => {
        lockRequest(true, data, dispatch).then(card => dispatch({
            type: OPEN_CARD_DIALOG,
            payload: card
        }));
    }
}

export function closeCardDialog(data, locked)
{
    if (locked) {
        return {
            type: CLOSE_CARD_DIALOG,
        }
    }
    
    return dispatch => {
        dispatch({
            type: CLOSE_CARD_DIALOG
        });

        lockRequest(false, data, dispatch);
    }
}

export function covert2ScrumboardCard(card)
{
    const fields = ['idMembers', 'idLabels', 'attachments', 'activities', 'idAttachmentCover'];

    if (card) {
        fields.forEach(field => {
            card[field] = card.detail[field] || [];
        });
        card['due'] = card['due_date'] ? card['due_date'].slice(0, 10) : '';
        card['orderlists'] = card.detail['orderlists']
        card['checklists'] = card.detail['checklists']
        card['idAttachmentCover'] = card.detail['idAttachmentCover'];
    }

    return card;
}

export function updateCard(card)
{
    return (dispatch) => {
        const detail = {};
        const fields = ['idMembers', 'idLabels', 'attachments', 'activities', 'idAttachmentCover'];

        fields.forEach(field => {
            if (card[field]) {
                detail[field] = card[field];
            }   
        });

        detail['orderlists'] = card['orderlists']
        detail['checklists'] = card['checklists']

        const request = axios.post('/api/card/add', {
            id_card: card.id,
            title: card.name,
            description: card.description,
            due_date: card.due,
            detail
        });

        dispatch({
            type: CLOSE_CARD_DIALOG
        });

        return request.then(
            (response) => {
                dispatch(showMessage({
                    message         : 'Card Saved',
                    autoHideDuration: 2000,
                    anchorOrigin    : {
                        vertical  : 'top',
                        horizontal: 'right'
                    }
                }));

                // const savedCard = _.get(response, 'data.card');
                // const newCard = covert2ScrumboardCard(savedCard);
                const newCard = card;

                lockRequest(false, newCard, dispatch);

                return dispatch({
                    type   : UPDATE_CARD,
                    payload: newCard
                });
            });
    }
}

export function removeCard(cardId)
{
    return (dispatch) => {
        dispatch({
            type: CLOSE_CARD_DIALOG
        });
        
        const request = axios.post('/api/card/del', {
            id_card: cardId
        });

        return request.then((response) =>
            dispatch({
                type: REMOVE_CARD,
                payload: cardId
            })
        );
    };
}
