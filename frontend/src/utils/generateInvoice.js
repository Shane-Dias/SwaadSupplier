import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoice = (order) => {
     
    const doc = new jsPDF();

    // Branding: Company Name or Logo
    doc.setFontSize(22);
    doc.setTextColor(234, 88, 12); // Orange color (Tailwind orange-600)
    doc.text("SwaadSupplier", 14, 20);

    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("INVOICE", 140, 20);

    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice No: INV-${order._id.slice(-6).toUpperCase()}`, 140, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 34);
    doc.text(`Status: ${order.status.toUpperCase()}`, 140, 40);

    // Vendor & Supplier Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Billed To (Vendor):", 14, 40);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
        `${order.vendor?.shopName || "Vendor Name"}\nLocation: ${order.vendor?.location || "N/A"
        }\nContact: ${order.vendor?.contact || "N/A"}`,
        14,
        46
    );

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Supplier:", 14, 65);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
        `${order.supplier?.shopName || "Supplier Name"}\nLocation: ${order.supplier?.location || "N/A"
        }`,
        14,
        46 + 25 // Adjusted Y position
    );

    // Table Columns
    const tableColumn = [
        "Item Name",
        "Category",
        "Quantity",
        "Unit Price (INR)",
        "Total (INR)",
    ];

    // Table Rows
    const tableRows = [];
    order.items.forEach((item) => {
        const itemData = [
            item.item.name,
            item.item.category,
            `${item.quantity} ${item.item.unitType}`,
            item.item.pricePerUnit.toFixed(2),
            (item.quantity * item.item.pricePerUnit).toFixed(2),
        ];
        tableRows.push(itemData);
    });

    // Generate Table
    autoTable(doc, {
        startY: 85,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [234, 88, 12], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Total Amount Calculation
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(
        `Total Amount: INR ${order.totalAmount.toFixed(2)}`,
        140,
        finalY,
        { align: "left" }
    );

    // Footer / Notes
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
        "Thank you for doing business with SwaadSupplier!",
        14,
        finalY + 20
    );
    doc.text(
        "This is a computer-generated invoice and does not require a signature.",
        14,
        finalY + 26
    );

    // Save PDF
    doc.save(`Invoice_SwaadSupplier_${order._id.slice(-6).toUpperCase()}.pdf`);
};

export default generateInvoice;
