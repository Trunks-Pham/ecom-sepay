'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              EcomSePay
            </Link>
            <div className="flex gap-6">
              <Link href="/products" className="text-gray-700 hover:text-blue-600">
                Sản phẩm
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-blue-600 font-medium">
                Giỏ hàng
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">Giỏ hàng của bạn trống</p>
            <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                {cartItems.map((item, index) => (
                  <div key={index} className="p-4 border-b flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-gray-600">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="font-bold">{item.price.toLocaleString()}VND</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-lg font-bold mb-4">Tóm tắt</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>0 VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>0 VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế:</span>
                    <span>0 VND</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Tổng:</span>
                    <span>0 VND</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
