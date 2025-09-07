'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvoicesList() {
  const [invoices, setInvoices] = useState([]);

  // تحميل الفواتير من localStorage عند التحميل
  useEffect(() => {
    const saved = localStorage.getItem('invoices');
    if (saved) {
      setInvoices(JSON.parse(saved));
    }
  }, []);



  // حذف فاتورة
  const deleteInvoice = (id) => {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الفاتورة؟')) {
      const updated = invoices.filter(inv => inv.id !== id);
      setInvoices(updated);
      localStorage.setItem('invoices', JSON.stringify(updated));
    }
  };

  // مسح كل الفواتير
  const clearAllInvoices = () => {
    if (confirm('⚠️ تحذير: سيتم حذف جميع الفواتير ولا يمكن التراجع!')) {
      setInvoices([]);
      localStorage.removeItem('invoices');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📂 جميع الفواتير</h1>
              <p className="text-gray-600 mt-1">عدد الفواتير: {invoices.length}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-center transition"
              >
                ➕ إنشاء فاتورة جديدة
              </Link>
              {invoices.length > 0 && (
                <button
                  onClick={clearAllInvoices}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
                >
                  🗑️ مسح الكل
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List of Invoices */}
        {invoices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد فواتير محفوظة</h3>
            <p className="text-gray-500">قم بإنشاء فاتورة وحفظها لتظهر هنا.</p>
            <Link 
              href="/invoice"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              إنشاء فاتورة جديدة
            </Link>
          </div>
        ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
  <table className="w-full border-collapse text-sm">
    <thead className="bg-gray-100 text-gray-800">
      <tr>
        <th className="border p-3 text-center">رقم الفاتورة</th>
        <th className="border p-3 text-center">اسم العميل</th>
        <th className="border p-3 text-center">التاريخ</th>
        <th className="border p-3 text-center">المجموع</th>
        <th className="border p-3 text-center">تاريخ الحفظ</th>
        <th className="border p-3 text-center">المنتجات</th>
        <th className="border p-3 text-center">الإجراءات</th>
      </tr>
    </thead>
    <tbody>
      {invoices.map((invoice) => (
        <tr key={invoice.id} className="hover:bg-gray-50 transition">
          <td className="border p-3 text-center text-black font-medium">#{invoice.invoiceNumber}</td>
          <td className="border p-3 text-black text-center">{invoice.customerName}</td>
          <td className="border p-3 text-black text-center">{invoice.invoiceDate}</td>
          <td className="border p-3 text-center font-bold text-green-600">
            {invoice.totalAmount.toFixed(2)} ج.م
          </td>
          <td className="border p-3 text-center text-gray-600">{invoice.savedAt}</td>
          <td className="border p-3 text-center">
            <div className="tooltip-container group">
              <span className="text-xs text-gray-500 underline decoration-dotted cursor-help">
                {invoice.products.length} منتجات
              </span>
              <div className="tooltip invisible group-hover:visible absolute z-10 mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap max-w-xs">
                {invoice.products.map(p => p.name).join(', ')}
              </div>
            </div>
          </td>
          <td className="border p-3 text-center">
            <div className="flex justify-center gap-2">
              <Link
                href={`/invocestable/${invoice.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition flex items-center justify-center gap-1"
              >
                👁️ عرض
              </Link>
              <button
                onClick={() => deleteInvoice(invoice.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition flex items-center justify-center gap-1"
              >
                🗑️ حذف
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        )}
      </div>
    </div>
  );
}