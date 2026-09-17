import mongoose, { Document, Schema } from 'mongoose';

export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

enrollmentSchema.index(
    { student: 1, course: 1 },
    { unique: true }
);

const Enrollment = mongoose.model<IEnrollment>(
    "Enrollment",
    enrollmentSchema
);

export default Enrollment;