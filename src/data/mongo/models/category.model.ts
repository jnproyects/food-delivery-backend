import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: [ true, 'Category Name is required' ],
        unique: true,
    },

    available: {
        type: Boolean,
        default: false,
    },

    //relación con UserModel
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});


categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret, options) {
        delete ret._id;
    },

});

export const CategoryModel = mongoose.model('Category', categorySchema);