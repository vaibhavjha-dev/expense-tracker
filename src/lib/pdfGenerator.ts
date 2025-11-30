import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Transaction } from "./types";
import { format } from "date-fns";
import { formatIndianNumber } from "./utils";

export const generatePDF = (transactions: Transaction[], startDate?: string, endDate?: string) => {
    const doc = new jsPDF();

    // Calculate totals
    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expenses;

    // Add title
    doc.setFontSize(20);
    doc.text("Expense Report", 14, 22);

    // Add date generated
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), "PPP")}`, 14, 30);

    // Add Date Range if present
    if (startDate || endDate) {
        const start = startDate ? format(new Date(startDate), "PPP") : "Beginning";
        const end = endDate ? format(new Date(endDate), "PPP") : "Now";
        doc.text(`Date Range: ${start} - ${end}`, 14, 36);
    }

    // Add Summary
    doc.setFontSize(12);
    doc.text("Summary", 14, 45);
    doc.setFontSize(10);
    doc.text(`Total Income: Rs. ${formatIndianNumber(income)}`, 14, 53);
    doc.text(`Total Expenses: Rs. ${formatIndianNumber(expenses)}`, 14, 59);
    doc.text(`Net Balance: Rs. ${formatIndianNumber(balance)}`, 14, 65);

    // Define table columns
    const tableColumn = ["Date", "Description", "Category", "Type", "Amount"];

    // Define table rows
    const tableRows = transactions.map((transaction) => [
        format(new Date(transaction.date), "MMM d, yyyy"),
        transaction.description,
        transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1),
        transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
        `${transaction.type === "income" ? "+" : "-"}Rs. ${formatIndianNumber(transaction.amount)}`,
    ]);

    // Generate table
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 75,
        theme: "grid",
        styles: {
            fontSize: 10,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [22, 163, 74], // Emerald-600 to match the theme
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        alternateRowStyles: {
            fillColor: [240, 253, 244], // Emerald-50
        },
    });

    // Save the PDF
    doc.save("expense-report.pdf");
};
