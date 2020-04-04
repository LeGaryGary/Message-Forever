import ago from 's-ago';

export async function GetContactMessagesAsync(){
    return [
        {
            sentBy: 'LeGaryGary',
            sentAt: new Date(1585968180 * 1000),
            timeContext: ago(new Date(1585968180 * 1000)),
            message: 'not a fcking boring filler message'
        }
    ]
}