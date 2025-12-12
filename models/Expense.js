import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    icon: { type: String },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: {type: Date, default:Date.now}
}, {
    timestamps:true
})

const ExpenseModels = mongoose.model("Expense", ExpenseSchema)
export default ExpenseModels;    