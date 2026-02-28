'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Fetch product details
    setLoading(false);
  }, [params.id]);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (!product) return <div className="text-center py-8">Sản phẩm không tìm thấy</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/products" className="text-blue-600 hover:underline">
            ← Quay lại sản phẩm
          </Link>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="w-full h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-2">
                  <div className="w-full h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-2">Tên sản phẩm</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl text-blue-600 font-bold">299.000 VND</span>
              <span className="text-gray-500 line-through">399.000 VND</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">-25%</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-gray-600">4.5 (128 reviews)</span>
            </div>

            <p className="text-gray-700 mb-6">
              Mô tả chi tiết sản phẩm sẽ hiển thị tại đây với các thông tin về
              chất liệu, kích thước, và hướng dẫn sử dụng.
            </p>

            {/* Variants */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Lựa chọn</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-2">Kích thước</label>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        className="px-4 py-2 border-2 rounded hover:border-blue-600"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">Màu sắc</label>
                  <div className="flex gap-2">
                    {['Đen', 'Trắng', 'Xanh'].map((color) => (
                      <button
                        key={color}
                        className="px-4 py-2 border-2 rounded hover:border-blue-600"
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Số lượng</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 text-center px-2 py-2 border rounded"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mb-3">
              Thêm vào giỏ hàng
            </button>

            {/* Stock Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                ✓ Còn hàng (102 sản phẩm)
              </p>
              <p className="text-sm text-gray-700">
                ✓ Giao hàng miễn phí cho đơn trên 500.000 VND
              </p>
              <p className="text-sm text-gray-700">
                ✓ Hoàn tiền 100% nếu không hài lòng
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>
                <h3 className="font-bold mb-2">Sản phẩm {i}</h3>
                <span className="text-blue-600 font-bold">299.000 VND</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
