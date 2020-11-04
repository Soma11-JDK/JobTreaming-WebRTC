import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    room: {
        type: String,
        required: "room is required"
    },
    writer: {
        type: String,
        required: "writer is required"
    },
    time: {
        type: Date,
        default: getCurrentDate(new Date())
    },
    context: {
        type: String,
        required: "context is required"
    },
    like: {
        type: Number,
        default: 0
    },
    questionComments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuestionComment"
        }
    ]
});

function getCurrentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}

const model = mongoose.model("Question", QuestionSchema);
export default model;