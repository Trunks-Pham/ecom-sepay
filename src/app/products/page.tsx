'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

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
              <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
                Sản phẩm
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-blue-600">
                Giỏ hàng
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                Đăng nhập
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Cửa hàng</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Bộ lọc</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Tên sản phẩm..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                >
                  <option value="">Tất cả danh mục</option>
                  <option value="fashion">Thời trang</option>
                  <option value="flowers">Hoa tươi</option>
                  <option value="tech">Đồ công nghệ</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (VND)
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Giá tối thiểu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Giá tối đa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Áp dụng bộ lọc
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Placeholder */}
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Link key={item} href={`/products/${item}`}>
                  <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer h-full">
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">Sản phẩm {item}</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Mô tả sản phẩm ngắn gọn
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-blue-600">299.000 VND</span>
                        <span className="text-sm text-gray-500">⭐ 4.5/5</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
