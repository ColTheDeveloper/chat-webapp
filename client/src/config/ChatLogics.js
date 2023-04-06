export const getSender=(loggedUser,users)=>{
    return users[0]._id===loggedUser._id?users[1].name :users[0].name
}

export const getSenderFull=(loggedUser,users)=>{
    return users[0]._id===loggedUser._id?users[1] :users[0]
}
// export const isSameSender=(messages,m,i,userId)=>{
    
//     return(
//         1< messages.length-1 &&
//         (messages[ 0].sender._id !== m.sender._id ||
//         messages[ 0].sender._id===undefined) &&
//         messages[i].sender._id !==userId
//     );
// };

// export const isLastMessage=(messages,i,userId)=>{
//     return(
//         i === messages.length -1 &&
//         messages[messages.length - 1].sender._id !==userId &&
//         messages[messages.length -1].sender._id
//     );
// };

// export const isSameSenderMargin=(messages,m,i,userId)=>{
//     if(
//         1<messages.length -1 && messages[i+1].sender._id===m.sender_id &&messages[i].sender._id !==userId
//     )
//     return 33;
//     else if (
//         (1< messages.length - 1 && messages[i+1].sender._id !== m.sender._id && messages[i].sender._id !==userId) ||
//         (i ===messages.length -1 && messages[i].sender._id !== userId) 
//     )
//     return 0;
//     else return "auto"
// }
// export const isSameUser=(messages,m,i)=>{
//     return i> 0 && messages[i-1].sender._id===m.sender._id
// }