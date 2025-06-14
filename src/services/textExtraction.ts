
export interface ExtractedTextData {
  text: string;
  confidence: number;
  metadata?: {
    pageCount?: number;
    language?: string;
    processingTime?: number;
  };
}

export interface ReceiptData {
  merchant: string;
  amount: number;
  date: string;
  category: string;
  items: Array<{ name: string; price: number }>;
  confidence: number;
  rawText: string;
}

class TextExtractionService {
  // Simulate OCR processing for images
  async extractTextFromImage(file: File): Promise<ExtractedTextData> {
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        // Mock extracted text based on file name or simulate realistic receipt text
        const mockText = this.generateMockReceiptText();
        resolve({
          text: mockText,
          confidence: 0.92,
          metadata: {
            language: 'en',
            processingTime: 1500
          }
        });
      }, 1500);
    });
  }

  // Extract text from PDF files
  async extractTextFromPDF(file: File): Promise<ExtractedTextData> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // In a real implementation, you'd use a PDF parsing library
        // For now, we'll simulate PDF text extraction
        setTimeout(() => {
          const mockText = this.generateMockDocumentText();
          resolve({
            text: mockText,
            confidence: 0.95,
            metadata: {
              pageCount: 1,
              language: 'en',
              processingTime: 800
            }
          });
        }, 800);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // Parse receipt data from extracted text
  parseReceiptData(extractedText: string): ReceiptData {
    const lines = extractedText.split('\n').filter(line => line.trim());
    
    // Simple parsing logic (in reality, you'd use more sophisticated NLP)
    let merchant = 'Unknown Merchant';
    let amount = 0;
    let date = new Date().toISOString().split('T')[0];
    let category = 'General';
    const items: Array<{ name: string; price: number }> = [];

    // Extract merchant (usually first or second line)
    if (lines.length > 0) {
      merchant = lines[0].replace(/[^a-zA-Z\s]/g, '').trim() || 'Unknown Merchant';
    }

    // Extract total amount (look for patterns like $XX.XX)
    const amountMatch = extractedText.match(/(?:total|amount|sum)[\s:]*\$?(\d+\.?\d*)/i);
    if (amountMatch) {
      amount = parseFloat(amountMatch[1]);
    }

    // Extract date (look for date patterns)
    const dateMatch = extractedText.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      date = dateMatch[1];
    }

    // Extract items (lines with price patterns)
    lines.forEach(line => {
      const itemMatch = line.match(/^(.+?)\s+\$?(\d+\.?\d*)$/);
      if (itemMatch && !line.toLowerCase().includes('total')) {
        items.push({
          name: itemMatch[1].trim(),
          price: parseFloat(itemMatch[2])
        });
      }
    });

    // Determine category based on merchant or items
    if (merchant.toLowerCase().includes('grocery') || merchant.toLowerCase().includes('market')) {
      category = 'Groceries';
    } else if (merchant.toLowerCase().includes('gas') || merchant.toLowerCase().includes('fuel')) {
      category = 'Transportation';
    } else if (merchant.toLowerCase().includes('restaurant') || merchant.toLowerCase().includes('cafe')) {
      category = 'Dining';
    }

    return {
      merchant,
      amount,
      date,
      category,
      items,
      confidence: 0.88,
      rawText: extractedText
    };
  }

  private generateMockReceiptText(): string {
    const receipts = [
      `WHOLE FOODS MARKET
123 Main Street
City, State 12345
Date: ${new Date().toLocaleDateString()}

Organic Bananas    $3.99
Almond Milk       $4.50
Chicken Breast    $12.99
Mixed Vegetables  $6.99
Whole Grain Bread $3.50

Subtotal:         $31.97
Tax:              $2.56
Total:            $34.53

Thank you for shopping!`,

      `TARGET STORE #1234
456 Shopping Ave
Date: ${new Date().toLocaleDateString()}

Laundry Detergent $8.99
Paper Towels      $5.49
Shampoo          $6.99
Cereal           $4.29
Milk             $3.99

Subtotal:        $29.75
Tax:             $2.38
Total:           $32.13`,

      `SHELL GAS STATION
789 Highway Road
Date: ${new Date().toLocaleDateString()}

Regular Unleaded  $45.67
Coffee           $2.99
Energy Drink     $3.49

Total:           $52.15`
    ];

    return receipts[Math.floor(Math.random() * receipts.length)];
  }

  private generateMockDocumentText(): string {
    return `BANK STATEMENT
ABC Bank
Account Number: ****1234
Statement Period: ${new Date().toLocaleDateString()} - ${new Date().toLocaleDateString()}

Beginning Balance: $2,450.00

TRANSACTIONS:
Date        Description              Amount    Balance
${new Date().toLocaleDateString()}  Direct Deposit          +$3,200.00  $5,650.00
${new Date().toLocaleDateString()}  Grocery Store           -$87.45     $5,562.55
${new Date().toLocaleDateString()}  Gas Station            -$45.67     $5,516.88
${new Date().toLocaleDateString()}  Restaurant             -$32.18     $5,484.70

Ending Balance: $5,484.70`;
  }
}

export const textExtractionService = new TextExtractionService();
