

export function layoutShift(comments, newCommentForms, viewport) {
    if(comments)
        comments.forEach((item) => {
            layoutShiftCommentButtons(item, viewport)
        })

    if(newCommentForms)
        newCommentForms.forEach((item) => {
            layoutShiftNewCommentForm(item, viewport)
        })
}

function layoutShiftCommentButtons(comment, viewport) {
    let replyButton = comment.querySelector(".reply-button")
    let deleteEditButtonsContainer = comment.querySelector(".delete-edit-buttons-container")

    if(viewport === "big") {
        if(replyButton)
            comment.querySelector(".user-info-wrapper").appendChild(replyButton)
        else
            comment.querySelector(".user-info-wrapper").appendChild(deleteEditButtonsContainer)
    }
    else if(viewport === "small") {
        if(replyButton)
            comment.querySelector(".function-buttons-container").appendChild(replyButton)
        else
            comment.querySelector(".function-buttons-container").appendChild(deleteEditButtonsContainer)
    }
}

function layoutShiftNewCommentForm(newCommentForm, viewport) {
    let currentUserImageContainer = newCommentForm.querySelector(".current-user-image-container")
    let newCommentButton = newCommentForm.querySelector(".new-comment-button")

    if(viewport === "big") {
        let textarea = newCommentForm.querySelector("textarea")
        textarea.before(currentUserImageContainer)
        textarea.after(newCommentButton)
    }
    else if(viewport === "small") {
        let userButtonContainer = newCommentForm.querySelector(".user-send-button-container")
        userButtonContainer.appendChild(currentUserImageContainer)
        userButtonContainer.appendChild(newCommentButton)
    }
}