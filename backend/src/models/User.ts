import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;

}

const userSchema = new Schema<IUser>({
    firstName: {
         type: String,
          required: true ,
          trim:true
         },
     lastName: {
        type: String,
        required: true,
        trim:true
          }, 
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase: true
        },
     password: {
        type: String,
        required: true,
        minlength: 6
        },
       role: {
            type: String,
            enum: ["student", "instructor"],
            default: "student",
        },   

        


    


}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;