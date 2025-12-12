    import ExpenseModels from '../models/Expense.js'
    import xlsx from 'xlsx'
    import path from "path";

    const addExpense = async (req, res) => {
        const userId = req.user._id;
        console.log("userId", userId);

        try {

            const { icon, category, date, amount } = req.body;

            if (!category || !amount || !date) {
                return res.json({
                    message: "Required fields are missing",
                    status: false
                })
            }

            const newExpense = new ExpenseModels({
                userId,
                icon,
                category,
                amount,
                date: new Date(date)
            })

            await newExpense.save()
            res.status(200).json({
                message: "Expense added successfully",
                status: true,
                expense: newExpense
            });

        } catch (error) {
            res.json({
                message: "something went wrong" || error.message,
                status: false
            })
        }



    }
    const getAllExpense = async (req, res) => {
        const userId = req.user._id
        console.log("userId", userId);

        try {

            const expense = await ExpenseModels.find({ userId }).sort({ date: -1 })
            res.json({
                message: "All expenses successfully get",
                stats: true,
                expense: expense
            })

        } catch (error) {
            res.json({
                message: "something went wrong" || error.message,
                status: false
            })
        }
    }
    const deleteExpense = async (req, res) => {
        try {
            const userId = req.user._id
            //    console.log("userId", userId);

            //    console.log("req.params", req.params.id);

            await ExpenseModels.findByIdAndDelete(req.params.id)
            res.json({
                message: "Successfully deleted!",
                status: true,
            })
        } catch (error) {
            res.json({
                message: "something went wrong" || error.message,
                status: false
            })
        }
    }
    const downloadExpenseExcel = async (req, res) => {
        try {
            const userId = req.user._id
            console.log("userId", userId);

            const expense = await ExpenseModels.find({ userId })
            console.log("expense", expense.length);


            const data = expense.map((item) => ({
                Category: item.category,
                Amount: item.amount,
                Date: item.date ? item.date.toISOString().split("T")[0] : ""
            }))

            console.log("Data", data);

            const wb = xlsx.utils.book_new()
            const ws = xlsx.utils.json_to_sheet(data)
            xlsx.utils.book_append_sheet(wb, ws, "Expense")
            const filePath = path.join(process.cwd(), "expense_details.xlsx");
            xlsx.writeFile(wb, filePath);
            res.download(filePath);

        } catch (error) {
            res.json({
                message: error.message || "something went wrong",
                status: false
            })
        }
    }

    export { addExpense, getAllExpense, deleteExpense, downloadExpenseExcel }