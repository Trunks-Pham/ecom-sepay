'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="text-blue-600 hover:underline">
                ← Quay lại Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Quản lý đơn hàng</h1>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">Danh sách đơn hàng</h2>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold">Mã đơn</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Khách hàng</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Trạng thái</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Thanh toán</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
