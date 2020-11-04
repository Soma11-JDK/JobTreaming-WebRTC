import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
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
    context: String,
    fileURL: String
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

const model = mongoose.model("Comment", CommentSchema);
export default model;