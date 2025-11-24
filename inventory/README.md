# 📦 Inventory Management System

Hệ thống quản lý kho hàng được xây dựng bằng **React + Vite + Tailwind CSS** với chức năng thêm sản phẩm, tìm kiếm, tính tổng giá trị kho hàng và chuyển đổi theme sáng/tối.

---

## 🎯 Tính năng chính

- ✅ **Thêm sản phẩm** với thông tin: tên, số lượng, giá, tỉnh/thành phố, phường/xã
- 🔍 **Tìm kiếm sản phẩm** theo tên (real-time)
- 💰 **Tính tổng giá trị kho hàng** tự động (quantity × price)
- 🌓 **Chuyển đổi theme** Light/Dark mode với Tailwind CSS
- 🗑️ **Xóa sản phẩm** 
- 📍 **Chọn địa điểm** từ 44 tỉnh/thành phố và hàng nghìn phường/xã Việt Nam
- 🎨 **Giao diện responsive** với Tailwind CSS

---

## 📁 Cấu trúc thư mục

```
inventory/
├── src/
│   ├── components/
│   │   └── InventoryManager.jsx    # Component chính chứa logic quản lý kho
│   ├── context/
│   │   └── ThemeContext.jsx        # Context quản lý theme (Light/Dark)
│   ├── data/
│   │   ├── provinces.json          # Dữ liệu 44 tỉnh/thành phố VN
│   │   └── wards.json              # Dữ liệu phường/xã VN
│   ├── App.jsx                     # Component gốc
│   ├── App.css                     # CSS tùy chỉnh
│   ├── index.css                   # Tailwind directives
│   └── main.jsx                    # Entry point
├── public/                         # Static assets
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
├── tailwind.config.cjs             # Tailwind configuration
├── postcss.config.cjs              # PostCSS configuration
└── README.md                       # File này
```

---

## 🚀 Cài đặt và chạy dự án

### **Yêu cầu:**
- Node.js >= 14.0
- npm hoặc yarn

### **Bước 1: Clone hoặc tải project**
```powershell
cd D:\Midterm\inventory
```

### **Bước 2: Cài đặt dependencies**
```powershell
npm install
```

### **Bước 3: Chạy development server**
```powershell
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173/`

### **Bước 4: Build production**
```powershell
npm run build
```

---

## 📚 Chi tiết code cho Newbie

### **1. Entry Point - `main.jsx`**

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Giải thích:**
- `StrictMode`: Chế độ strict của React để phát hiện lỗi tiềm ẩn
- `createRoot`: API mới của React 18 để render ứng dụng
- `document.getElementById('root')`: Tìm element có id="root" trong `index.html`
- Render component `<App />` vào trong element root

---

### **2. Tailwind CSS Setup - `index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Giải thích:**
- `@tailwind base`: Import các style reset và base styles của Tailwind
- `@tailwind components`: Import các component classes của Tailwind
- `@tailwind utilities`: Import các utility classes (px-4, bg-blue-500, v.v.)

---

### **3. Tailwind Config - `tailwind.config.cjs`**

```javascript
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',  // ← Quan trọng: bật dark mode bằng class
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Giải thích:**
- `content`: Tailwind sẽ scan những file này để tìm class names
- `darkMode: 'class'`: Bật dark mode bằng cách thêm class `dark` vào `<html>`
- `theme.extend`: Có thể tùy chỉnh thêm colors, spacing, v.v.

---

### **4. Theme Context - `ThemeContext.jsx`**

```javascript
import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

**Giải thích từng phần:**

#### **a. createContext()**
```javascript
export const ThemeContext = createContext()
```
- Tạo một Context object để chia sẻ data giữa các components
- Context giúp tránh "prop drilling" (truyền props qua nhiều tầng components)

#### **b. ThemeProvider Component**
```javascript
export function ThemeProvider({ children }) {
```
- `{ children }`: Destructuring props, nhận tất cả component con
- Component này sẽ bọc (wrap) toàn bộ app

#### **c. State Management**
```javascript
const [theme, setTheme] = useState('light')
```
- `theme`: state lưu giá trị hiện tại ('light' hoặc 'dark')
- `setTheme`: hàm để thay đổi giá trị theme
- `useState('light')`: khởi tạo theme mặc định là 'light'

#### **d. useEffect - Side Effect**
```javascript
useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, [theme])
```
- `useEffect`: chạy side effect khi `theme` thay đổi
- `document.documentElement`: trỏ đến thẻ `<html>`
- `.classList.add('dark')`: thêm class "dark" vào `<html class="dark">`
- `[theme]`: dependency array - effect chạy lại khi theme thay đổi

**Tại sao cần thêm class vào `<html>`?**
- Tailwind dark mode hoạt động bằng cách kiểm tra class `dark` trên parent element
- Khi có class `dark`, mọi class `dark:*` sẽ được áp dụng
- VD: `dark:bg-gray-900` chỉ hoạt động khi có `<html class="dark">`

#### **e. toggleTheme Function**
```javascript
const toggleTheme = () => {
  setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
}
```
- `prevTheme`: giá trị theme trước đó
- Ternary operator: nếu 'light' → đổi thành 'dark', ngược lại → 'light'
- Sử dụng callback form để đảm bảo state cập nhật chính xác

#### **f. Provider**
```javascript
return (
  <ThemeContext.Provider value={{ theme, toggleTheme }}>
    {children}
  </ThemeContext.Provider>
)
```
- `ThemeContext.Provider`: cung cấp value cho tất cả component con
- `value={{ theme, toggleTheme }}`: object chứa 2 giá trị được chia sẻ
- `{children}`: render tất cả component con bên trong Provider

---

### **5. App Component - `App.jsx`**

```javascript
import InventoryManager from './components/InventoryManager'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <InventoryManager />
    </ThemeProvider>
  )
}

export default App
```

**Giải thích:**
- `<ThemeProvider>`: Bọc toàn bộ app để tất cả components có thể access theme
- `<InventoryManager />`: Component chính chứa logic nghiệp vụ
- Kiến trúc clean: App chỉ lo setup providers, logic nghiệp vụ ở InventoryManager

**Luồng dữ liệu:**
```
ThemeProvider (cung cấp theme, toggleTheme)
    ↓
InventoryManager (sử dụng useContext để lấy theme)
```

---

### **6. InventoryManager Component - `InventoryManager.jsx`**

Đây là component phức tạp nhất, chứa toàn bộ logic quản lý kho hàng.

#### **a. Imports**
```javascript
import { useState, useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import provincesData from '../data/provinces.json'
import wardsData from '../data/wards.json'
```

**Giải thích:**
- `useState`: Hook để quản lý local state
- `useContext`: Hook để truy cập Context
- `provincesData`: Object chứa 44 tỉnh/thành phố (key-value pairs)
- `wardsData`: Object chứa hàng nghìn phường/xã

**Cấu trúc dữ liệu provinces.json:**
```json
{
  "11": {
    "name": "Hà Nội",
    "name_with_type": "Thành phố Hà Nội",
    "code": "11"
  },
  "12": {
    "name": "Hồ Chí Minh",
    "name_with_type": "Thành phố Hồ Chí Minh",
    "code": "12"
  }
}
```

**Cấu trúc dữ liệu wards.json:**
```json
{
  "267": {
    "name": "Minh Châu",
    "name_with_type": "Xã Minh Châu",
    "code": "267",
    "parent_code": "11"  // ← Link đến province code
  }
}
```

---

#### **b. State Declarations**

```javascript
const [products, setProducts] = useState([])
const [searchTerm, setSearchTerm] = useState('')
const { theme, toggleTheme } = useContext(ThemeContext)
const [formData, setFormData] = useState({
  name: '',
  quantity: '',
  price: '',
  province: '',
  ward: ''
})
```

**Giải thích từng state:**

1. **`products`**: Mảng chứa tất cả sản phẩm
   ```javascript
   // Ví dụ cấu trúc:
   [
     {
       id: 1732435200000,
       name: "iPhone 15",
       quantity: 10,
       price: 999.99,
       province: "Thành phố Hà Nội",
       ward: "Xã Minh Châu"
     }
   ]
   ```

2. **`searchTerm`**: Từ khóa tìm kiếm (string)
   - User gõ vào search box → state này update
   - Dùng để filter `products` array

3. **`theme` và `toggleTheme`**: Lấy từ ThemeContext
   ```javascript
   const { theme, toggleTheme } = useContext(ThemeContext)
   ```
   - `theme`: giá trị hiện tại ('light' hoặc 'dark')
   - `toggleTheme`: function để chuyển đổi theme

4. **`formData`**: Object chứa dữ liệu form
   - Controlled components: mỗi input đồng bộ với state
   - Reset về rỗng sau khi submit

---

#### **c. Data Processing**

```javascript
const provinces = Object.values(provincesData)
```

**Giải thích:**
- `Object.values()`: Chuyển object thành array
- Từ `{ "11": {...}, "12": {...} }` → `[{...}, {...}]`
- Cần array để dùng `.map()` render dropdown options

```javascript
const availableWards = Object.values(wardsData).filter(
  ward => ward.parent_code === formData.province
)
```

**Giải thích chi tiết:**
1. `Object.values(wardsData)`: Chuyển object → array
2. `.filter()`: Lọc các phần tử thỏa điều kiện
3. `ward.parent_code === formData.province`: Chỉ lấy wards thuộc tỉnh đã chọn

**Ví dụ:**
```javascript
// User chọn province code = "11" (Hà Nội)
formData.province = "11"

// availableWards sẽ chỉ chứa wards có parent_code = "11"
[
  { code: "267", name: "Minh Châu", parent_code: "11" },
  { code: "268", name: "Hoàng Mai", parent_code: "11" },
  // ... các wards khác của Hà Nội
]
```

---

#### **d. Event Handlers**

##### **handleProvinceChange - Xử lý khi chọn tỉnh**
```javascript
const handleProvinceChange = (e) => {
  const provinceCode = e.target.value
  setFormData({ ...formData, province: provinceCode, ward: '' })
}
```

**Giải thích từng dòng:**
1. `e.target.value`: Lấy giá trị của `<select>` được chọn
2. `{ ...formData }`: Spread operator - copy tất cả properties cũ
3. `province: provinceCode`: Override province mới
4. `ward: ''`: Reset ward về rỗng (vì province đổi rồi)

**Tại sao phải reset ward?**
- Khi đổi tỉnh, ward cũ không còn hợp lệ
- VD: Đang chọn "Hà Nội - Xã Minh Châu", đổi sang "TP.HCM" → phải reset ward

**Flow:**
```
User chọn tỉnh mới
  ↓
handleProvinceChange được gọi
  ↓
setFormData cập nhật province, reset ward
  ↓
availableWards tự động re-calculate (vì formData.province đổi)
  ↓
Dropdown ward hiển thị danh sách mới
```

---

##### **handleAddProduct - Thêm sản phẩm mới**
```javascript
const handleAddProduct = (e) => {
  e.preventDefault()
  
  // Validation
  if (!formData.name || !formData.quantity || !formData.price || 
      !formData.province || !formData.ward) {
    alert('Please fill in all fields')
    return
  }

  // Lấy tên đầy đủ của province và ward
  const selectedProvinceData = provincesData[formData.province]
  const selectedWardData = wardsData[formData.ward]

  // Tạo product object
  const newProduct = {
    id: Date.now(),
    name: formData.name,
    quantity: parseInt(formData.quantity),
    price: parseFloat(formData.price),
    province: selectedProvinceData?.name_with_type || '',
    ward: selectedWardData?.name_with_type || ''
  }

  // Thêm vào array
  setProducts([...products, newProduct])
  
  // Reset form
  setFormData({ name: '', quantity: '', price: '', province: '', ward: '' })
}
```

**Giải thích chi tiết từng phần:**

1. **`e.preventDefault()`**
   - Ngăn form reload trang (hành vi mặc định của `<form onSubmit>`)
   - Quan trọng: Không có dòng này, trang sẽ reload và mất hết state

2. **Validation**
   ```javascript
   if (!formData.name || !formData.quantity || ...) {
     alert('Please fill in all fields')
     return
   }
   ```
   - Kiểm tra tất cả fields có giá trị không
   - `!formData.name`: true nếu empty string (`''`)
   - `return`: Dừng function nếu thiếu dữ liệu

3. **Lấy tên đầy đủ từ code**
   ```javascript
   const selectedProvinceData = provincesData[formData.province]
   ```
   - `formData.province = "11"` → lấy object tại key "11"
   - `selectedProvinceData.name_with_type = "Thành phố Hà Nội"`

4. **Tạo product object**
   ```javascript
   const newProduct = {
     id: Date.now(),  // Timestamp unique ID
     name: formData.name,
     quantity: parseInt(formData.quantity),  // String → Number
     price: parseFloat(formData.price),      // String → Float
     province: selectedProvinceData?.name_with_type || '',
     ward: selectedWardData?.name_with_type || ''
   }
   ```

   **Chi tiết:**
   - `Date.now()`: Timestamp (ms từ 1/1/1970), luôn unique
   - `parseInt()`: Chuyển "10" → 10
   - `parseFloat()`: Chuyển "99.99" → 99.99
   - `?.`: Optional chaining - tránh lỗi nếu undefined
   - `|| ''`: Fallback về empty string nếu null/undefined

5. **Immutable update**
   ```javascript
   setProducts([...products, newProduct])
   ```
   - `[...products]`: Tạo array mới, copy tất cả phần tử cũ
   - `, newProduct`: Thêm phần tử mới vào cuối
   - **KHÔNG được**: `products.push(newProduct)` (mutate trực tiếp)
   
   **Tại sao phải immutable?**
   - React so sánh reference để detect thay đổi
   - Nếu mutate trực tiếp, React không re-render

6. **Reset form**
   ```javascript
   setFormData({ name: '', quantity: '', price: '', province: '', ward: '' })
   ```
   - Đặt tất cả fields về rỗng
   - Form sẵn sàng cho lần nhập tiếp theo

---

##### **handleDeleteProduct - Xóa sản phẩm**
```javascript
const handleDeleteProduct = (id) => {
  setProducts(products.filter(product => product.id !== id))
}
```

**Giải thích:**
- `.filter()`: Tạo array mới chỉ chứa phần tử thỏa điều kiện
- `product.id !== id`: Giữ tất cả products TRỪ cái có id trùng

**Ví dụ:**
```javascript
products = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" }
]

// Xóa id=2
handleDeleteProduct(2)

// Kết quả:
[
  { id: 1, name: "A" },
  { id: 3, name: "C" }
]
```

---

#### **e. Computed Values (Giá trị tính toán)**

##### **filteredProducts - Lọc sản phẩm theo search**
```javascript
const filteredProducts = products.filter(product =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase())
)
```

**Giải thích:**
1. `.toLowerCase()`: Chuyển về chữ thường (case-insensitive search)
2. `.includes()`: Kiểm tra chuỗi có chứa substring không
3. Re-calculate tự động mỗi khi `products` hoặc `searchTerm` thay đổi

**Ví dụ:**
```javascript
searchTerm = "phone"
products = [
  { name: "iPhone 15" },     // ✅ match (chứa "phone")
  { name: "Laptop Dell" },   // ❌ không match
  { name: "Headphone Sony" } // ✅ match (chứa "phone")
]

// filteredProducts sẽ có 2 items: iPhone và Headphone
```

---

##### **totalValue - Tổng giá trị kho hàng**
```javascript
const totalValue = products.reduce((sum, product) => 
  sum + (product.quantity * product.price), 0
)
```

**Giải thích chi tiết `reduce()`:**

**Syntax:**
```javascript
array.reduce((accumulator, currentValue) => {
  // logic
  return newAccumulator
}, initialValue)
```

**Trong code này:**
- `sum`: accumulator (tổng tích lũy)
- `product`: current product đang duyệt
- `0`: initial value (bắt đầu từ 0)

**Flow thực thi:**
```javascript
products = [
  { quantity: 2, price: 10 },  // Item 1
  { quantity: 3, price: 5 },   // Item 2
  { quantity: 1, price: 20 }   // Item 3
]

// Iteration 1:
sum = 0
product = { quantity: 2, price: 10 }
return 0 + (2 * 10) = 20

// Iteration 2:
sum = 20
product = { quantity: 3, price: 5 }
return 20 + (3 * 5) = 35

// Iteration 3:
sum = 35
product = { quantity: 1, price: 20 }
return 35 + (1 * 20) = 55

// Final result: totalValue = 55
```

---

## 🎨 Tailwind Dark Mode

### **Cách hoạt động:**

1. **Config**: `darkMode: 'class'` trong `tailwind.config.cjs`

2. **ThemeContext** thêm class vào `<html>`:
   ```javascript
   document.documentElement.classList.add('dark')
   // → <html class="dark">
   ```

3. **Conditional Classes**:
   ```javascript
   className="bg-gray-100 dark:bg-gray-900"
   ```
   - Light mode: áp dụng `bg-gray-100`
   - Dark mode: áp dụng `dark:bg-gray-900`

4. **CSS Generated**:
   ```css
   .bg-gray-100 { background-color: #f3f4f6; }
   
   .dark .dark\:bg-gray-900 { background-color: #111827; }
   ```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────┐
│           ThemeProvider                 │
│   (theme, toggleTheme)                  │
└───────────────┬─────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────┐
│          InventoryManager                     │
│                                               │
│  ┌─────────────────────────────────────┐     │
│  │ States:                             │     │
│  │  - products []                      │     │
│  │  - searchTerm ""                    │     │
│  │  - formData {name, qty, price...}  │     │
│  └─────────────────────────────────────┘     │
│                                               │
│  ┌─────────────────────────────────────┐     │
│  │ Computed Values:                    │     │
│  │  - filteredProducts (from search)   │     │
│  │  - totalValue (reduce)              │     │
│  │  - availableWards (filter)          │     │
│  └─────────────────────────────────────┘     │
│                                               │
│  ┌─────────────────────────────────────┐     │
│  │ Event Handlers:                     │     │
│  │  - handleAddProduct()               │     │
│  │  - handleDeleteProduct(id)          │     │
│  │  - handleProvinceChange()           │     │
│  └─────────────────────────────────────┘     │
│                                               │
│                    ▼                          │
│  ┌─────────────────────────────────────┐     │
│  │ JSX (UI)                            │     │
│  │  - Form inputs                      │     │
│  │  - Search box                       │     │
│  │  - Products table                   │     │
│  │  - Theme toggle button              │     │
│  └─────────────────────────────────────┘     │
└───────────────────────────────────────────────┘
```

---

## 🐛 Common Errors cho Newbie

### **1. Không có `key` prop trong `.map()`**
```javascript
// ❌ SAI
{products.map((product) => <tr>...</tr>)}

// ✅ ĐÚNG
{products.map((product) => <tr key={product.id}>...</tr>)}
```

### **2. Mutate state trực tiếp**
```javascript
// ❌ SAI
products.push(newProduct)
setProducts(products)

// ✅ ĐÚNG
setProducts([...products, newProduct])
```

### **3. Gọi function trong onClick**
```javascript
// ❌ SAI - Gọi ngay lập tức
onClick={handleDelete(id)}

// ✅ ĐÚNG - Chỉ gọi khi click
onClick={() => handleDelete(id)}
```

### **4. Quên `e.preventDefault()`**
```javascript
const handleSubmit = (e) => {
  e.preventDefault()  // ← Quan trọng!
  // ...
}
```

### **5. Không parse number từ input**
```javascript
// ❌ SAI - quantity là string "10"
quantity: formData.quantity

// ✅ ĐÚNG - parse thành number 10
quantity: parseInt(formData.quantity)
```

---

## 💡 Best Practices được áp dụng

1. **✅ Component Composition**: Tách ThemeProvider riêng
2. **✅ Controlled Components**: Input values đồng bộ với state
3. **✅ Immutable Updates**: Dùng spread operator
4. **✅ Descriptive Naming**: `handleAddProduct`, `filteredProducts`
5. **✅ Conditional Rendering**: Empty states, ternary operators
6. **✅ Context API**: Tránh prop drilling
7. **✅ Responsive Design**: Tailwind responsive classes
8. **✅ Accessibility**: Placeholder text, disabled states

---

## 📚 Học thêm

### **React Concepts:**
- [React Hooks](https://react.dev/reference/react)
- [Context API](https://react.dev/learn/passing-data-deeply-with-context)
- [Controlled Components](https://react.dev/learn/sharing-state-between-components)

### **Tailwind CSS:**
- [Utility-First CSS](https://tailwindcss.com/docs/utility-first)
- [Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Responsive Design](https://tailwindcss.com/docs/responsive-design)

### **JavaScript:**
- [Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [Spread Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

---

**Happy Coding! 🚀**
