'use client';
import Image from 'next/image';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

function generateInvoiceNumber() {
  return `INV-${Math.floor(100000 + Math.random() * 900000)}`;
}

export default function InvoiceApp() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: '', quantity: 1, price: 0 }
  ]);

  const [customerName, setCustomerName] = useState('العميل');
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSummary, setShowSummary] = useState(false);

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), name: '', quantity: 1, price: 0 }]);
  };

  const removeProduct = (id: number) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const updateProduct = (id: number, field: keyof Product, value: string | number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => total + (product.quantity * product.price), 0);
  };

  const printInvoice = () => {
    window.print();
    window.location.reload();
  };

  return (
    <div className="container w-screen px-2 md:mx-auto lg:p-4 md:p-8">
     
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">

      <Image src={"/logo.png"} alt="Logo" width={150} height={50} className="mx-auto mb-8" />
        <h2 className="text-2xl  text-black font-semibold mb-6 text-center">الفاتورة</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         
          
          <div>
            <label className="block text-gray-700 mb-2">اسم العميل</label>
            <input
              type="text"
              placeholder={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">رقم الفاتورة</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">تاريخ الفاتورة</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </div>
        </div>
        
        <h3 className="text-xl text-black font-semibold mb-4">المنتجات</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 text-right whitespace-nowrap">اسم المنتج</th>
                <th className="px-2 py-2 text-right whitespace-nowrap">الكمية</th>
                <th className="px-2 py-2 text-right whitespace-nowrap">السعر</th>
                <th className="px-2 py-2 text-right whitespace-nowrap">المجموع</th>
                <th className="px-2 py-2 text-right whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      placeholder={product.name}
                      onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                      min="1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value) || 1)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                      min="1"
                      step="1"
                    />
                  </td>
                  <td className="px-2 py-2">{(product.quantity * product.price).toFixed(2)}</td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-2 py-2 text-left font-semibold">الإجمالي</td>
                <td className="px-2 py-2 font-semibold">{calculateTotal().toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row gap-2 justify-between">
          <button
            onClick={addProduct}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            إضافة منتج
          </button>
          <button
            onClick={() => setShowSummary(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto"
          >
             الفاتورة
          </button>
        </div>
      </div>

      {/* ملخص الفاتورة */}
      {showSummary && (
        <div className="fixed inset-0 bg-white bg-opacity-20  flex items-center justify-center z-50 print:bg-transparent print:static print-summary">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl print:shadow-none print:p-0 print:w-full">
              <Image src={"/logo.png"} alt="Logo" width={90} height={50} className="mx-auto mb-8" />
                          <h2 className="text-2xl text-black font-semibold mb-4 text-center"> الفاتورة</h2>
            <table className="w-full mb-4 border">
              <tbody>
            
                <tr>
                  <td className="text-black p-2">اسم العميل</td>
                  <td className="p-2 text-black ">{customerName}</td>
                </tr>
                <tr>
                  <td className="text-black p-2">رقم الفاتورة</td>
                  <td className="p-2 text-black ">{invoiceNumber}</td>
                </tr>
                <tr>
                  <td className="text-black p-2">تاريخ الفاتورة</td>
                  <td className="p-2 text-black ">{invoiceDate}</td>
                </tr>
              </tbody>
            </table>
            <table className="w-full text-black  table-auto border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-center">اسم المنتج</th>
                  <th className="px-4 py-2 text-center">الكمية</th>
                  <th className="px-4 py-2 text-center">السعر</th>
                  <th className="px-4 py-2 text-center">المجموع</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-4 py-2 text-center">{product.name}</td>
                    <td className="px-4 py-2 text-center">{product.quantity}</td>
                    <td className="px-4 py-2 text-center">{product.price}</td>
                    <td className="px-4 py-2 text-center">{(product.quantity * product.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-2 text-left font-semibold">الإجمالي</td>
                  <td className="px-4 py-2 font-semibold">{calculateTotal().toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            <div className="flex justify-end gap-2 print:hidden">
              <button
                onClick={() => {
                  window.print();
                  window.location.reload();
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                طباعة
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ستايل خاص للطباعة */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-summary, .print-summary * {
            visibility: visible !important;
          }
          .print-summary {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            z-index: 9999 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          /* اجعل بداية الطباعة من أول الورقة وبدون هوامش */
          @page {
            size: auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}