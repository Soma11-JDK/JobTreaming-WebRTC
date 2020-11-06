import { main } from "../../io";
import EVENT from "../../event";
import Question from "../../../models/Question";
import QuestionComment from "../../../models/QuestionComment";

const questionHandler = async (socket, data) => {
    try {
        const newQuestion = await Question.create({
            room: data.roomName,
            writer: data.userName,
            context: data.text
        });
        main.in(data.roomName).emit('question', newQuestion);
        console.log('question', data, newQuestion.time, newQuestion.questionComments.length, newQuestion.questionComments.length, newQuestion._id);
    } catch (error) {
        console.log(error);
    }
}

const likeUpHandler = async (socket, data) => {
    try {
        //update like
        const questionId = data.questionId;
        const res = await Question.findByIdAndUpdate(questionId, { $inc: { "like": 1 } }, { new: true });
        //send like
        main.in(data.roomName).emit('like', { questionId, like: res.like });
    } catch (error) {
        console.log(error);
    }
}

const likeDownHandler = async (socket, data) => {
    try {
        //update like
        const questionId = data.questionId;
        const res = await Question.findByIdAndUpdate(questionId, { $inc: { "like": -1 } }, { new: true });
        //send like
        main.in(data.roomName).emit('like', { questionId, like: res.like });
    } catch (error) {
        console.log(error);
    }
}

const questionCommentHandler = async (socket, data) => {
    try {
        const newQuestionComment = await QuestionComment.create({
            writer: data.userName,
            context: data.text
        });
        const res = await Question.findByIdAndUpdate(data.questionId, { $push: { questionComments: newQuestionComment } }, { new: true });
        main.in(data.roomName).emit('questionComment', {
            time: newQuestionComment.time,
            userName: data.userName,
            text: data.text,
            questionId: data.questionId,
            questionCnt: res.questionComments.length
        });
    } catch (error) {
        console.log(error);
    }
}

const questionAllHandler = async (socket, roomName) => {
    try {
        console.log('qeustionAll', roomName);
        const questions = await Question.find({ room: roomName }).populate('questionComments');
        socket.emit('qeustionAll', questions);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { questionHandler, likeUpHandler, likeDownHandler, questionCommentHandler, questionAllHandler };
