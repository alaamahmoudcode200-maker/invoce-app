'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // جلب الفاتورة من localStorage
  useEffect(() => {
    try {
      const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const found = savedInvoices.find(inv => String(inv.id) === String(id));

      if (found) {
        setInvoice(found);
      } else {
        setInvoice(null);
      }
    } catch (error) {
      console.error('خطأ في تحميل الفاتورة:', error);
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // وظيفة الطباعة
  const handlePrint = () => {
    if (!invoice) return;

    const printWin = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    const invoiceHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فاتورة #${invoice.invoiceNumber}</title>
  <style>
    body {
      font-family: Tahoma, Arial, sans-serif;
      padding: 20px;
      margin: 0;
      background: #fff;
      color: #333;
      direction: rtl;
    }
    @media print {
      @page { margin: 10mm; }
      body { padding: 0; }
    }
    .container { max-width: 800px; margin: 0 auto; }
    .header {
      text-align: center;
      padding: 10px 0;
      border-bottom: 4px solid #1d4ed8;
      margin-bottom: 20px;
    }
    .header h1 { color: #1d4ed8; font-size: 28px; margin: 0; }
    .header p { margin: 5px 0 0; color: #666; }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .info-row div { flex: 1; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }
    th {
      background-color: #f3f4f6;
      font-weight: bold;
    }

    .total-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      font-size: 18px;
      font-weight: bold;
      margin: 20px 0;
    }
    .total-amount { color: #166534; }

    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #eee;
      color: #666;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>A2Z</h1>
      <p>شركة A2Z - شكرًا لثقتكم</p>
    </div>

    <div class="info-row">
      <div><strong>اسم العميل:</strong> ${invoice.customerName}</div>
      <div><strong>تاريخ الإصدار:</strong> ${invoice.invoiceDate}</div>
    </div>
    <div class="info-row">
      <div><strong>رقم الفاتورة:</strong> #${invoice.invoiceNumber}</div>
      <div><strong>تم الحفظ في:</strong> ${invoice.savedAt}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>المنتج</th>
          <th>الكمية</th>
          <th>السعر</th>
          <th>الإجمالي</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.products.map(p => `
          <tr>
            <td>${p.name}</td>
            <td>${p.qty}</td>
            <td>${p.price.toFixed(2)}</td>
            <td>${p.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="total-box">
      <span>المبلغ الإجمالي:</span>
      <span class="total-amount">${invoice.totalAmount.toFixed(2)} ج.م</span>
    </div>

    <div class="footer">
      <p>شكراً لتعاملكم معنا — للتواصل: 0123456789</p>
    </div>
  </div>

  <script>
    window.print();
    setTimeout(() => window.close(), 800);
  </script>
</body>
</html>
    `;

    printWin.document.open();
    printWin.document.write(invoiceHtml);
    printWin.document.close();
  };

  // حالة التحميل
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">جارٍ التحميل...</div>
      </div>
    );
  }

  // حالة عدم وجود الفاتورة
  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">الفاتورة غير موجودة</h2>
          <p className="text-gray-600 mb-6">لا يمكن العثور على فاتورة بهذا الرقم.</p>
          <Link
            href="/invoices"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105"
          >
            العودة إلى القائمة
          </Link>
        </div>
      </div>
    );
  }

  // واجهة العرض التفصيلي
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📄 فاتورة # {invoice.invoiceNumber}</h1>
              <p className="text-gray-600 mt-1">تم الحفظ في: {invoice.savedAt}</p>
            </div>
            <Link
              href="/invocestable"
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
            >
              ← العودة للقائمة
            </Link>
          </div>
        </div>

        {/* تفاصيل الفاتورة */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          
          {/* معلومات العميل والتاريخ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-5 bg-blue-50 rounded-lg">
            <div>
              <p className="text-gray-700"><strong>اسم العميل:</strong> <span className="font-medium text-gray-900">{invoice.customerName}</span></p>
              <p className="text-gray-700"><strong>تاريخ الإصدار:</strong> <span className="font-medium text-gray-900">{invoice.invoiceDate}</span></p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-gray-700"><strong>رقم الفاتورة:</strong> <span className="font-medium text-gray-900">#{invoice.invoiceNumber}</span></p>
              <p className="text-gray-700"><strong>عدد المنتجات:</strong> <span className="font-medium text-gray-900">{invoice.products.length}</span></p>
            </div>
          </div>

          {/* جدول المنتجات */}
          <div className="overflow-x-auto mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              📦 المنتجات ({invoice.products.length})
            </h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-800">
                  <th className="border p-3 text-center rounded-tl-lg">اسم المنتج</th>
                  <th className="border p-3 text-center">الكمية</th>
                  <th className="border p-3 text-center">السعر</th>
                  <th className="border p-3 text-center rounded-tr-lg">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {invoice.products.map((p, index) => (
                  <tr key={index} className="hover:bg-gray-50 text-black">
                    <td className="border p-3 text-center">{p.name}</td>
                    <td className="border p-3 text-center">{p.qty}</td>
                    <td className="border p-3 text-center">{p.price.toFixed(2)}</td>
                    <td className="border p-3 text-center font-medium text-green-700">{p.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* الإجمالي النهائي */}
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 font-bold text-xl">
            <span className="text-gray-800">المبلغ الإجمالي النهائي:</span>
            <span className="text-green-700">{invoice.totalAmount.toFixed(2)} <span className="text-sm">ج.م</span></span>
          </div>

          {/* زر الطباعة */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition transform hover:scale-105 shadow-md flex items-center gap-2"
            >
              🖨️ طباعة الفاتورة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}