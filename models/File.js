import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: "fileName is required"
    },
    fileSize: Number,
    fileType: {
        type: String,
        enum: ["image", "file"]
    },
    fileURL: {
        type: String,
        required: "fileURL is required"
    },
    room: {
        type: String,
        required: "room is required"
    },
    time: {
        type: Date,
        default: getCurrentDate(new Date())
    }
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

const model = mongoose.model("File", FileSchema);
export default model;