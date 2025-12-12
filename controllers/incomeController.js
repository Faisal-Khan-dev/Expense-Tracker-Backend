import IncomeModels from '../models/Income.js'
import xlsx from 'xlsx'
import path from "path";

const addIncome = async(req, res)=>{ 
    const userId = req.user._id; 
    console.log("userId", userId);
    
    try {

        const {icon, source, date, amount} = req.body;

        if (!source || !amount || !date) {
            return res.json({
                message: "Required fields are missing",
                status: false
            })
        }

        const newIncome = new IncomeModels({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        })

        await newIncome.save()
        res.status(200).json({
            message: "Income added successfully",
            status: true,
            income: newIncome
        });
        
    } catch (error) {
        res.json({
            message: "something went wrong" || error.message,
            status: false
        })
    }


    
}
const getAllIncome = async(req, res)=>{
    const userId = req.user._id
    console.log("userId", userId);
     
    try {

        const income = await IncomeModels.find({ userId }).sort({ date: -1 })
        res.json({
            message: "All incomes successfully get",
            stats: true,
            income: income
        })
        
    } catch (error) {
        res.json({
            message: "something went wrong" || error.message,
            status: false
        })
    }
}
const deleteIncome = async(req, res)=>{
   try {
       const userId = req.user._id
    //    console.log("userId", userId);

    //    console.log("req.params", req.params.id);

       await IncomeModels.findByIdAndDelete(req.params.id)
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
const downloadIncomeExcel = async(req, res)=>{
    try {
        const userId = req.user._id
        console.log("userId", userId);
        
        const income = await IncomeModels.find({ userId })
        console.log("incomes", income.length);
        

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date ? item.date.toISOString().split("T")[0] : ""   
        }))

        console.log("Data" , data);

        const wb = xlsx.utils.book_new() 
        const ws = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(wb, ws, "Income")
        const filePath = path.join(process.cwd(), "income_details.xlsx");
        xlsx.writeFile(wb, filePath);
        res.download(filePath);

    } catch (error) {
        res.json({
            message: error.message || "something went wrong",
            status: false
        })
    }
}

export  {addIncome, getAllIncome, deleteIncome, downloadIncomeExcel}