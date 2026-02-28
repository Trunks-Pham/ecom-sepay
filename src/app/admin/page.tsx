'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
              }}
              className="text-red-600 hover:text-red-800"
            >
              Đăng xuất
            </button>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">Tổng quan</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm uppercase tracking-wide">Đơn hàng</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm uppercase tracking-wide">Doanh thu</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalRevenue.toLocaleString()} VND</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm uppercase tracking-wide">Sản phẩm</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm uppercase tracking-wide">Người dùng</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/products">
            <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">📦 Sản phẩm</h3>
              <p className="text-gray-600">Quản lý sản phẩm, tạo mới, chỉnh sửa</p>
            </div>
          </Link>

          <Link href="/admin/categories">
            <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">📂 Danh mục</h3>
              <p className="text-gray-600">Quản lý danh mục sản phẩm</p>
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">📋 Đơn hàng</h3>
              <p className="text-gray-600">Quản lý đơn hàng, cập nhật trạng thái</p>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">👥 Người dùng</h3>
            <p className="text-gray-600">Quản lý tài khoản người dùng</p>
          </div>
        </div>
      </div>
    </div>
  );
}
