
import React from "react";

interface ParsedReceiptDataProps {
  parsedReceipt: {
    merchant: string;
    amount: number;
    date: string;
    category: string;
    items: Array<{ name: string; price: number }>;
  };
}

const ParsedReceiptData: React.FC<ParsedReceiptDataProps> = ({ parsedReceipt }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-200">
      <h3 className="font-medium text-blue-800">Receipt Data Detected</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-blue-600 uppercase tracking-wide">Merchant</p>
          <p className="font-medium">{parsedReceipt.merchant}</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 uppercase tracking-wide">Amount</p>
          <p className="font-medium text-lg">${parsedReceipt.amount}</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 uppercase tracking-wide">Date</p>
          <p className="font-medium">{parsedReceipt.date}</p>
        </div>
        <div>
          <p className="text-xs text-blue-600 uppercase tracking-wide">Category</p>
          <p className="font-medium">{parsedReceipt.category}</p>
        </div>
      </div>

      {parsedReceipt.items.length > 0 && (
        <div>
          <p className="text-xs text-blue-600 uppercase tracking-wide mb-2">Items</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {parsedReceipt.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>${item.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParsedReceiptData;
