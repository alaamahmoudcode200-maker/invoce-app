'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvoiceApp() {
  const [customerName, setCustomerName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [productName, setProductName] = useState('');
  const [productQty, setProductQty] = useState(1);
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // ضبط تاريخ اليوم عند التحميل
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setInvoiceDate(today);
  }, []);

  // حساب المجموع الإجمالي عند تغيير المنتجات
  useEffect(() => {
    const total = products.reduce((sum, p) => sum + p.total, 0);
    setTotalAmount(total);
  }, [products]);

  // إضافة منتج جديد
  const addProduct = () => {
    if (!productName.trim() || productQty <= 0 || !productPrice || parseFloat(productPrice) <= 0) {
      alert('يرجى إدخال بيانات صحيحة للمنتج');
      return;
    }

    const price = parseFloat(productPrice);
    const total = productQty * price;

    const newProduct = {
      id: Date.now(),
      name: productName.trim(),
      qty: productQty,
      price: price,
      total: total,
    };

    setProducts([...products, newProduct]);
    setProductName('');
    setProductQty(1);
    setProductPrice('');
  };

  // حذف منتج
  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // توليد رقم فاتورة عشوائي
  const generateInvoiceNumber = () => Math.floor(1000 + Math.random() * 9000);

  // حفظ الفاتورة في localStorage
  const saveInvoice = () => {
    if (products.length === 0) {
      alert('لا يمكن حفظ فاتورة فارغة!');
      return;
    }

    const invoiceNumber = generateInvoiceNumber();
    const newInvoice = {
      id: Date.now(),
      invoiceNumber,
      customerName: customerName || 'غير محدد',
      invoiceDate,
      products: [...products],
      totalAmount,
      savedAt: new Date().toLocaleDateString('ar-EG'),
    };

    const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    savedInvoices.push(newInvoice);
    localStorage.setItem('invoices', JSON.stringify(savedInvoices));

    alert('✅ تم حفظ الفاتورة بنجاح!');
  };

  // طباعة الفاتورة (بدون حفظ تلقائي)
  const printInvoice = () => {
    if (products.length === 0) return;

    const invoiceNumber = generateInvoiceNumber();
    const invoiceHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فاتورة #${invoiceNumber}</title>
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
      <div><strong>اسم العميل:</strong> ${customerName || 'غير محدد'}</div>
      <div><strong>تاريخ الإصدار:</strong> ${invoiceDate}</div>
    </div>
    <div class="info-row">
      <div><strong>رقم الفاتورة:</strong> #${invoiceNumber}</div>
      <div><strong>الموظف:</strong> أحمد محمد</div>
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
        ${products.map(p => `
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
      <span class="total-amount">${totalAmount.toFixed(2)} ج.م</span>
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

    const printWin = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    printWin.document.open();
    printWin.document.write(invoiceHtml);
    printWin.document.close();
  };

  // مسح الفاتورة بدون إعادة تحميل
  const clearInvoice = () => {
    if (confirm('⚠️ هل أنت متأكد أنك تريد مسح كل محتويات الفاتورة؟')) {
      setCustomerName('');
      setProducts([]);
      setTotalAmount(0);
      setProductName('');
      setProductQty(1);
      setProductPrice('');
      const today = new Date().toISOString().split('T')[0];
      setInvoiceDate(today);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 text-center">
          <h1 className="text-3xl font-bold">A2Z</h1>
          <p className="mt-1 text-sm md:text-base">شركة A2Z - شكرًا لثقتكم</p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* رابط لعرض جميع الفواتير */}
        

          {/* Customer & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم العميل</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="مثال: أحمد علي"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الفاتورة</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Add Product */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-lg font-semibold text-black mb-4 flex items-center">
              <span>➕</span>
              <span className="mr-2">إضافة منتج جديد</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="اسم المنتج"
                className="p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={productQty}
                onChange={(e) => setProductQty(parseInt(e.target.value) || 1)}
                min="1"
                placeholder="الكمية"
                className="p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                step="0.01"
                placeholder="السعر"
                className="p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                إضافة
              </button>
            </div>
          </div>

          {/* Products Table */}
          {products.length > 0 && (
            <div className="overflow-x-auto">
              <h3 className="text-md font-semibold text-black mb-3">المنتجات المضافة ({products.length})</h3>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="border p-3 text-right">اسم المنتج</th>
                    <th className="border p-3 text-center">الكمية</th>
                    <th className="border p-3 text-center">السعر</th>
                    <th className="border p-3 text-center">الإجمالي</th>
                    <th className="border p-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 text-black">
                      <td className="border p-3 text-right">{product.name}</td>
                      <td className="border p-3 text-center">{product.qty}</td>
                      <td className="border p-3 text-center">{product.price.toFixed(2)}</td>
                      <td className="border p-3 text-center font-medium">{product.total.toFixed(2)}</td>
                      <td className="border p-3 text-center">
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Total & Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div>
              <span className="text-gray-700 font-medium">المجموع النهائي:</span>
              <span className="text-2xl font-extrabold text-green-600 mr-2">{totalAmount.toFixed(2)} ج.م</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={printInvoice}
                disabled={products.length === 0}
                className={`px-6 py-3 rounded-lg font-bold text-white text-lg transition transform hover:scale-105 ${
                  products.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md'
                }`}
              >
                🖨️ طباعة
              </button>
              <button
                onClick={saveInvoice}
                disabled={products.length === 0}
                className={`px-6 py-3 rounded-lg font-bold text-white text-lg transition transform hover:scale-105 ${
                  products.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md'
                }`}
              >
                💾 حفظ
              </button>
            </div>
          </div>

          {/* Clear Button */}
            <div className="text-center grid grid-cols-2 items-center  mb-6">
              <div className="mb-4">
                  <Link 
              href="/invocestable" 
              className=" px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg text-lg transition transform hover:scale-105 shadow-md"
            >
              📂 عرض جميع الفواتير
            </Link>
                </div>   
                    <div className="mb-4">
                      <button
            onClick={clearInvoice}
            className=" px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg text-lg transition transform cursor-pointer shadow-md"
          >
            🗑️ مسح الفاتورة
          </button>
                </div>   
          
         
          </div>
       
        </div>
      </div>
    </div>
  );
}