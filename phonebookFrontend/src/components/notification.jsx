import React from 'react'

export const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={ message.type === "error" ? "error" : "notification" }>
            { message.content }
        </div>
        
    )
}

