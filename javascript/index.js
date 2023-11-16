import { createComment, createReplyContainer, createNewCommentForm } from '/javascript/createElement.js'
import { layoutShift } from '/javascript/layoutShift.js'

window.onload = loadCommentsAndForms

function loadCommentsAndForms() {
    fetch("/tailwindclasses.json").then((response) => response.json()).then(
        (classJsonData) => {
            fetch("/data.json").then((response) => response.json()).then((commentJsonData) => {
                loadComments(classJsonData, commentJsonData["comments"], commentJsonData["currentUser"])
                loadNewCommentForm(classJsonData, commentJsonData["currentUser"])
            })
        }
    )
}

function loadComments(designClasses, commentJsonData, currentUser) {
    let main = document.querySelector("main")

    for(let i = 0; i < commentJsonData.length; i++) {
        let comment = createComment(designClasses, commentJsonData[i], currentUser)
        main.appendChild(comment)

        if(commentJsonData[i]["replies"].length != 0) {
            let repliesContainer = loadReplies(designClasses, commentJsonData[i]["replies"], currentUser)
            comment.after(repliesContainer)
        }
    }
}

function loadReplies(designClasses, commentJsonData, currentUser) {
    let repliesContainer = createReplyContainer(designClasses)
    let repliesContainerInnerWrapper = repliesContainer.querySelector(".replies-inner-wrapper")

    for(let i = 0; i < commentJsonData.length; i++) {
        let reply = createComment(designClasses, commentJsonData[i], currentUser, true)
        repliesContainerInnerWrapper.appendChild(reply)
    }

    return repliesContainer
}

function loadNewCommentForm(designClasses, currentUser) {
    let newCommentForm = createNewCommentForm(designClasses, currentUser)
    document.querySelector("main").appendChild(newCommentForm)
}

window.onresize = function () {
    let comments = document.querySelectorAll(".comment-container")
    let newCommentForm = document.querySelectorAll(".new-comment")

    if(window.innerWidth >= 1440)
        layoutShift(comments, newCommentForm, "big")
    else
        layoutShift(comments, newCommentForm, "small")
}