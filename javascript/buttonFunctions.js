import { createAlertModal, createNewCommentForm, createComment, createReplyContainer, createEditCommentButton } from "/javascript/createElement.js"

let currentReplyForm = null

export function increaseVoteCount(e) {
    e.currentTarget.nextElementSibling.textContent = parseInt(e.currentTarget.nextElementSibling.textContent) + 1
}

export function decreaseVoteCount(e) {
    e.currentTarget.previousElementSibling.textContent = parseInt(e.currentTarget.previousElementSibling.textContent) - 1
}

export function replyToComment(e) {
    let comment = e.currentTarget.closest(".comment-container")

    if(currentReplyForm === comment.nextElementSibling) {
        currentReplyForm.remove()
        return
    }

    if(currentReplyForm) {
        currentReplyForm.remove()
    }

    fetch("/tailwindclasses.json").then((response) => response.json()).then((classJsonData) => {
        fetch("/data.json").then((response) => response.json()).then((commentJsonData) => {
            currentReplyForm = createNewCommentForm(classJsonData, commentJsonData["currentUser"], true)
            comment.after(currentReplyForm)
        })
    })
}

export function editComment(e) {
    let currentComment = e.currentTarget.closest(".comment-container")

    if(currentComment.classList.contains("being-edited"))
        return

    let commentContent = currentComment.querySelector(".comment-content")
    let replyTo = commentContent.querySelector(".reply-to")
    let textareaField = document.createElement("textarea")
    currentComment.classList.toggle("being-edited")

    fetch("/tailwindclasses.json").then((response) => response.json()).then((classJsonData) => {
        classJsonData["textarea"]["edit comment textarea field"].split(" ").forEach((item) => {
            textareaField.classList.add(item)
        })
        textareaField.style.minHeight = getComputedStyle(commentContent).height
        textareaField.textContent = (replyTo) ? replyTo.nextSibling.nodeValue : commentContent.textContent
        
        commentContent.after(textareaField)
        commentContent.style.display = "none"

        let editCommentButtonContainer = createEditCommentButton(classJsonData)

        let commentWrapper = currentComment.querySelector(".wrapper")

        commentWrapper.appendChild(editCommentButtonContainer)
    })
}

export function updateComment(e) {
    let currentComment = e.currentTarget.closest(".comment-container")
    let commentContent = currentComment.querySelector(".comment-content")
    let textareaField = currentComment.querySelector(".text-input-field")

    let replyTo = commentContent.querySelector(".reply-to")

    let textNode = document.createTextNode(textareaField.value)
    
    
    commentContent.style.display = "block"
    
    textareaField.remove()
    
    e.currentTarget.closest(".update-button-container").remove()
    currentComment.classList.toggle("being-edited")
    
    if(textNode.nodeValue.length == 0)
        return

    if(replyTo)
        commentContent.lastChild.remove()
    else
        commentContent.firstChild.remove()
    commentContent.appendChild(textNode)
}

export function deleteCommentAlert(e) {
    let currentComment = e.currentTarget.closest(".comment-container")
    fetch("/tailwindclasses.json").then((response) => response.json()).then((classJsonData) => {
        createAlertModal(classJsonData, currentComment)
    })
}

export function cancelCommentDelete(e) {
    e.currentTarget.closest(".modal-overlay").remove()
}

export function deleteComment(e, currentComment) {
    currentComment.remove()
    e.currentTarget.closest(".modal-overlay").remove()
}

export function addNewComment(e, reply = false) {
    e.preventDefault()
    let newCommentForm = e.currentTarget.closest(".new-comment")
    let currentUser = {
            "image": {
                "png": newCommentForm.querySelector(".user-image").src
            },
            "username": newCommentForm.getAttribute("username")
    }
    
    fetch("/tailwindclasses.json").then((response) => response.json()).then((classJsonData) => {
        let newCommentContent = getNewCommentContent(newCommentForm)

        if(newCommentContent === "")
            return

        let randID = Math.floor((Math.random() * Number.MAX_SAFE_INTEGER) + 1)
        let commentData = {
            "id": randID,
            "content": newCommentContent,
            "createdAt": "just now",
            "score": 0,
            "user": currentUser,
            "replies": []
        }

        if(!reply) {
            let newComment = createComment(classJsonData, commentData, currentUser)
            newCommentForm.before(newComment)
        }
        else {
            let replyingTo = newCommentForm.previousElementSibling.querySelector(".username").textContent
            commentData["replyingTo"] = replyingTo

            let newComment = createComment(classJsonData, commentData, currentUser, true)

            if(newCommentForm.nextElementSibling.classList.contains("replies-outer-wrapper")) {
                newCommentForm.nextElementSibling.querySelector(".replies-inner-wrapper").appendChild(newComment)
                newCommentForm.remove()
            }
            else {
                let repliesContainer = createReplyContainer(classJsonData)
                repliesContainer.querySelector(".replies-inner-wrapper").appendChild(newComment)
                newCommentForm.after(repliesContainer)
                newCommentForm.remove()
            }
        }
    })
}

function getNewCommentContent(newCommentForm) {
    return newCommentForm.querySelector("textarea").value
}