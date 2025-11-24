import { useState, useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import provincesData from '../data/provinces.json'
import wardsData from '../data/wards.json'

function InventoryManager() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [selectedProvince, setSelectedProvince] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    province: '',
    ward: ''
  })

  // Convert provinces object to array
  const provinces = Object.values(provincesData)
  
  // Filter wards based on selected province
  const availableWards = Object.values(wardsData).filter(
    ward => ward.parent_code === formData.province
  )

  // Handle province change
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value
    setFormData({ ...formData, province: provinceCode, ward: '' })
  }

  // Add product
  const handleAddProduct = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.quantity || !formData.price || !formData.province || !formData.ward) {
      alert('Please fill in all fields')
      return
    }

    const selectedProvinceData = provincesData[formData.province]
    const selectedWardData = wardsData[formData.ward]

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      province: selectedProvinceData?.name_with_type || '',
      ward: selectedWardData?.name_with_type || ''
    }

    setProducts([...products, newProduct])
    setFormData({ name: '', quantity: '', price: '', province: '', ward: '' })
  }

  // Delete product
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id))
  }

  // Filter products by search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate total inventory value
  const totalValue = products.reduce((sum, product) => 
    sum + (product.quantity * product.price), 0
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Inventory Management System
          </h1>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 font-medium hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        {/* Add Product Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Add New Product
          </h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              min="0"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              step="0.01"
              min="0"
            />
            
            <select
              value={formData.province}
              onChange={handleProvinceChange}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">Select Province</option>
              {provinces.map(province => (
                <option key={province.code} value={province.code}>
                  {province.name_with_type}
                </option>
              ))}
            </select>

            <select
              value={formData.ward}
              onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
              disabled={!formData.province}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Ward</option>
              {availableWards.map(ward => (
                <option key={ward.code} value={ward.code}>
                  {ward.name_with_type}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Search and Total Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Search Products
            </h2>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Total Inventory Value
            </h2>
            <p className="text-4xl font-bold text-white">
              ${totalValue.toFixed(2)}
            </p>
            <p className="text-green-100 mt-2">
              {products.length} product{products.length !== 1 ? 's' : ''} in inventory
            </p>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Products List
          </h2>
          
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              {products.length === 0 ? 'No products added yet. Add your first product above!' : 'No products match your search.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                      Product Name
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                      Province
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                      Ward
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                      Total Value
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr 
                      key={product.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-800 dark:text-white">
                        {product.name}
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-white">
                        {product.quantity}
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-white">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-white">
                        {product.province}
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-white">
                        {product.ward}
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-white font-semibold">
                        ${(product.quantity * product.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InventoryManager
