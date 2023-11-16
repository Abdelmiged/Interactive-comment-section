const upvoteImagePath = "/images/icon-plus.svg"
const downvoteImagePath = "/images/icon-minus.svg"
const deleteImagePath = "/images/icon-delete.svg"
const editImagePath = "/images/icon-edit.svg"
const replyImagePath = "/images/icon-reply.svg"

import * as buttonFunctions from "/Interactive-comment-section/javascript/buttonFunctions.js"
import { layoutShift } from "/Interactive-comment-section/javascript/layoutShift.js"

// Create a new comment
export function createComment(designClasses, commentData, currentUser, reply = false) {
    let commentContainer = document.createElement("div")

    designClasses["div"]["comment container"].split(" ").forEach((item) => {
        commentContainer.classList.add(item)
    })

    commentContainer.setAttribute("commentid", commentData["id"])
    commentContainer.innerHTML = `
        <div class="${designClasses["div"]["comment wrapper"]}">
            <div class="${designClasses["div"]["wrapper"]}">
                <div class="${designClasses["div"]["user info wrapper"]}">
                    <div class="${designClasses["div"]["user time container"]}">
                        <div class="${designClasses["div"]["user image container"]}">
                            <img class="${designClasses["img"]["user image"]}" src="${commentData["user"]["image"]["png"]}" alt="user image">
                        </div>
                        <span class="${designClasses["span"]["username span"]}">${commentData["user"]["username"]} ${(commentData["user"]["username"] === currentUser["username"]) ? `<span class="${designClasses["span"]["you tag span"]}">you</span>` : ""}</span>
                        <span class="${designClasses["span"]["comment time span"]}">${commentData["createdAt"]}</span>
                    </div>
                </div>
                <p class="${designClasses["p"]["comment paragraph"]}">${(reply) ? `<span class="${designClasses["span"]["reply to span"]}">@${commentData["replyingTo"]} </span>` : ""}${commentData["content"]}</p>
            </div>
            <div class="${designClasses["div"]["function buttons container"]}">
                <div class="${designClasses["div"]["upvote downvote container"]}">
                    <button class="${designClasses["button"]["upvote button"]}">
                        <img class="${designClasses["img"]["upvote button img"]}" src="${upvoteImagePath}" alt="">
                    </button>
                    <span class="${designClasses["span"]["vote count span"]}">${commentData["score"]}</span>
                    <button class="${designClasses["button"]["downvote button"]}">
                        <img class="${designClasses["img"]["downvote button img"]}" src="${downvoteImagePath}" alt="">
                    </button>
                </div>

                ${(commentData["user"]["username"] === currentUser["username"]) ? 
                    `<div class="${designClasses["div"]["delete edit buttons container"]}">
                        <button class="${designClasses["button"]["delete button"]}">
                            <img class="${designClasses["img"]["delete edit reply button img"]}" src="${deleteImagePath}" alt="">
                            <span class="${designClasses["span"]["delete button span"]}">Delete</span>
                        </button>
                        <button class="${designClasses["button"]["edit button"]}">
                            <img class="${designClasses["img"]["delete edit reply button img"]}" src="${editImagePath}" alt="">
                            <span class="${designClasses["span"]["edit button span"]}">Edit</span>
                        </button>
                    </div>` :
                    `<button class="${designClasses["button"]["reply button"]}">
                        <img class="${designClasses["img"]["delete edit reply button img"]}" src="${replyImagePath}" alt="">
                        <span class="${designClasses["span"]["reply button span"]}">Reply</span>
                    </button>`
                }
            </div>
        </div>
    `
    appendCommentButtonFunctions(commentContainer)
    
    if(window.innerWidth >= 1440)
        layoutShift([commentContainer], null, "big")

    return commentContainer
}

// Add Comment button functionalities
function appendCommentButtonFunctions(comment) {
    comment.querySelector(".upvote-button").addEventListener("click", buttonFunctions.increaseVoteCount)
    comment.querySelector(".downvote-button").addEventListener("click", buttonFunctions.decreaseVoteCount)
    
    let replyButton = comment.querySelector(".reply-button")
    let deleteButton = comment.querySelector(".delete-button")
    let editButton = comment.querySelector(".edit-button")

    if(replyButton)
        replyButton.addEventListener("click", buttonFunctions.replyToComment)
    else {
        deleteButton.addEventListener("click", buttonFunctions.deleteCommentAlert)
        editButton.addEventListener("click", buttonFunctions.editComment)
    }
}

// Creates reply comment wrapper
export function createReplyContainer(designClasses) {
    let div = document.createElement("div")

    designClasses["div"]["replies outer wrapper"].split(" ").forEach((item) => {
        div.classList.add(item)
    })

    div.innerHTML = `
        <div class="${designClasses["div"]["replies inner wrapper"]}"></div>
    `

    return div
}


// Creates the new comment form
export function createNewCommentForm(designClasses, currentUser, replyForm = false) {
    let form = document.createElement("form")

    designClasses["form"]["form container"].split(" ").forEach((item) => {
        form.classList.add(item)
    })

    form.setAttribute("username", currentUser["username"])

    form.innerHTML = `
        <textarea class="${designClasses["textarea"]["textarea field"]}" name="new-comment" placeholder="Add a comment..."></textarea>
        <div class="${designClasses["div"]["send button form container"]}">
            <div class="${designClasses["div"]["current user image container"]}">
                <img class="${designClasses["img"]["user image"]}" src="${currentUser["image"]["png"]}" alt="user image" username="${currentUser["username"]}">
            </div>
            <input class="${designClasses["input"]["input send button"]}" type="submit" value="${(replyForm) ? `REPLY` : `SEND`}">
        </div>
    `

    form.querySelector(".new-comment-button").addEventListener("click", (e) => {buttonFunctions.addNewComment(e, (replyForm) ? true: false)})

    if(window.innerWidth >= 1440)
        layoutShift(null, [form], "big")

    return form
}

// Create Delete comment alert modal
export function createAlertModal(designClasses, currentComment) {
    let modalOverlay = document.createElement("div")
    
    designClasses["div"]["modal overlay"].split(" ").forEach((item) => {
        modalOverlay.classList.add(item)
    })

    modalOverlay.innerHTML = `
        <div class="${designClasses["div"]["delete comment alert"]}">
            <h1 class="${designClasses["h1"]["modal alert header"]}">Delete Comment</h1>
            <p class="${designClasses["p"]["modal alert paragraph"]}">Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
            <div class="${designClasses["div"]["modal buttons container"]}">
                <button class="${designClasses["button"]["modal cancel button"]}">NO, CANCEL</button>
                <button class="${designClasses["button"]["modal delete button"]}">YES, DELETE</button>
            </div>
        </div>
    `

    appendModalButtonFunctions(modalOverlay, currentComment)

    document.body.prepend(modalOverlay)
}

function appendModalButtonFunctions(modal, currentComment) {
    modal.querySelector(".modal-cancel-button").addEventListener("click", buttonFunctions.cancelCommentDelete)
    modal.querySelector(".modal-delete-button").addEventListener("click", (e) => buttonFunctions.deleteComment(e, currentComment))
}

export function createEditCommentButton(designClasses) {
    let editCommentContainer = document.createElement("div")
    let editCommentButton = document.createElement("button")

    designClasses["div"]["update button container"].split(" ").forEach((item) => {
        editCommentContainer.classList.add(item)
    })

    designClasses["input"]["input send button"].split(" ").forEach((item) => {
        editCommentButton.classList.add(item)
    })

    editCommentButton.classList.add("update-button")

    editCommentButton.textContent = "UPDATE"

    editCommentButton.addEventListener("click", buttonFunctions.updateComment)

    editCommentContainer.appendChild(editCommentButton)

    return editCommentContainer
}