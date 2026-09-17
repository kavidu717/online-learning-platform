import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
    title: string,
    description: string
    instructor: mongoose.Types.ObjectId,
    content: string,
    createdAt: Date
    updatedAt: Date
}

const courseSchema = new Schema<ICourse>({
    title: {
        type: String,
        required: true,
        trim: true

    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    content: {
        type: String,
        required: true,
        trim: true
    }
},{ timestamps: true })

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;