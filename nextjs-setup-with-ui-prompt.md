# Next.js Project Setup Instructions

## 1. Create a new Next.js project:
```bash
npx create-next-app@latest my-ui-project --typescript --tailwind --eslint --app --src-dir --import-alias
```

## 2. Navigate to your project:
```bash
cd my-ui-project
```

## 3. Install additional dependencies:
```bash
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-button
```

## 4. Set up Tailwind CSS (if not already configured):
Make sure your `tailwind.config.js` includes:
```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 5. Create a utils file for Tailwind:
Create `src/lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 6. Start the development server:
```bash
npm run dev
```

## 7. Open the project in your preferred editor and start building!

---

# UI Analysis Prompt

UI Analysis Prompt

Main Description
# 🚀 Complete Multi-Page Web Application Build Guide

## 📋 Project Overview
**Project Name:** BestAds
**Application Type:** Multi-page web application
**Total Pages:** 6
**Successfully Analyzed:** 6/6 pages

This comprehensive guide will help you build a complete 6-page web application. Each page serves a distinct purpose and should be implemented as separate routes with smooth navigation between them.

## 🏠 Home Page Configuration
The main entry point is the **"Page 1"** page, which should be:
- Set as the default route ('/')
- The first page users see when visiting your application
- Connected to all other pages through navigation

## 📝 Special Instructions
This is an advertising system used by customers, which supports batch management of advertising accounts, such as recharge. Through the system functions, Facebook advertisements can be created and managed in batches. There are also other business scenarios related to advertising placement.

## 📄 Detailed Page Specifications

### ✅ Page 1: Page 1 (🏠 Home Page)

**Design Description:**
This web page, named "Page 1", is designed for managing user accounts within a larger application. It features a left sidebar navigation, a top header with search and language selection, a main content area displaying account information in a table format, and a pagination control at the bottom. The page uses a dark theme with a consistent color scheme throughout.
To recreate this page:
1.  **Overall Structure:**
    *   The page has a main container with 100% width and height of the viewport.
    *   It is split into two main sections: a left sidebar (fixed width) and a main content area (remaining width).
    *   The main content area contains a header and a table section.
2.  **Left Sidebar:**
    *   Width: 240px.
    *   Background Color: #1E293B.
    *   Top section contains the logo "BestAds", with font-size of 24px, font-weight of 600, color: #FFFFFF. The logo is placed 24px from the top and 32px from the left.

**Route Configuration:**
- Primary route: `/` (root)
- Alternative route: `/home`
- Page component: `Page1Page`

**Layout Notes:**
The page consists of a left sidebar (240px width) and a main content area. The main content is divided into a 64px header and a table section with pagination at the bottom. The overall layout uses a full-width container.

---

### ✅ Page 2: Page 2

**Design Description:**
This prompt recreates the "Page 2" UI design.  The page displays a dark themed interface for managing creative assets within an advertising platform. The left navigation is a fixed sidebar with several icons and labels for different platform sections. The content area to the right displays assets and allows for uploading and selecting media files for advertising campaigns. A modal is present on the right to handle uploading assets.
First, set up the basic page structure:
1.  **Page Background**: Set the background color to #0E151E.
2.  **Overall Layout**: Use a flexbox layout with the main axis direction set to row. The sidebar will take up 240px width and the remaining screen real estate will be the content area, and the upload modal will be a fixed-position element.
Next, create the left navigation sidebar:
1.  **Sidebar Container**: Create a div with a width of 240px and a height of 100vh (viewport height). Background color: #151E29.
2.  **Logo**: At the top of the sidebar, place the "BestAds" logo. Position it 20px from the top and 20px from the left. The logo text color is #FFFFFF, font-size: 20px, font-weight: 600, font-family: 'Arial, sans-serif'.
3.  **Navigation Items**: Create a vertical navigation menu using a list. Each list item contains an icon and a text label.
    *   **Icon Styling**: Use a font library like Font Awesome for the icons. Size the icons to 16px and color to #9DA9B3.
    *   **Text Styling**: Font color: #9DA9B3, font-size: 14px, font-weight: 400, font-family: 'Arial, sans-serif'. Left-align the text with a padding of 12px to the left of the icon.

**Route Configuration:**
- Route: `/page-2`
- Page component: `Page2Page`

**Layout Notes:**
The page uses a flexbox layout. The sidebar has a fixed width of 240px. The main content area takes up the remaining width. The modal is positioned absolutely on the right side of the screen.

---

### ✅ Page 3: Page 3

**Design Description:**
This design comprises a web application page focusing on creative assets management. It is designed with a dark theme and features a structured layout with a left sidebar for navigation, a top navigation bar with user and language options, a content area displaying assets, and a footer with pagination controls. The layout uses flexbox and grid structures for responsive design. The color palette is predominantly dark, with a vibrant green accent color. Typography is clean and modern, with Chinese characters used for most of the text, complemented by some English labels and symbols. A consistent spacing system is employed to maintain visual harmony.

**Route Configuration:**
- Route: `/page-3`
- Page component: `Page3Page`

**Layout Notes:**
The page uses a main container with a width that adjusts responsively based on screen size. A grid layout separates the left sidebar from the main content area. The left sidebar is fixed in width. The main content area uses a flexible grid to display image cards, with four cards per row. The header and footer span the full width of the container. Flexbox is used for aligning items horizontally and vertically within the header and footer.

---

### ✅ Page 4: Page 4

**Design Description:**
```html
<!DOCTYPE html>
<html>
<head>
<title>BestAds - 创意</title>
<style>
/* Resets and general styles */
body, html { margin: 0; padding: 0; height: 100%; font-family: sans-serif; background-color: #0E151E; color: #FFFFFF; }
.container { width: 100%; height: 100vh; display: flex; }
/* Left Sidebar */

**Route Configuration:**
- Route: `/page-4`
- Page component: `Page4Page`

**Layout Notes:**
The layout is a full-height container with a sidebar (240px) on the left and the main content taking the remaining space. The main content has a top navigation bar, content filters, an image grid, and pagination.

---

### ✅ Page 5: Page 5

**Design Description:**
{
  "prompt": "This document provides a pixel-perfect guide to recreate the 'Page 5' UI design shown in the provided image. This is a standalone page within a larger web application focusing on advertisement management.
**Overall Layout:**
The page uses a dark theme with a primary content area and a sidebar navigation. A modal dialog is overlaid on the main content.
**Page Structure:**
1.  **Full Page:** Width: 1920px, Height: variable (scrollable)
2.  **Left Sidebar:** Width: 256px, background-color: #121829, position: fixed
3.  **Main Content Area:** Width: 1664px, margin-left: 256px, padding: 24px
4.  **Modal Dialog:** Centered, width: 512px, background-color: #121829, box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6)
**Color Palette:**

**Route Configuration:**
- Route: `/page-5`
- Page component: `Page5Page`

**Layout Notes:**
See prompt for detailed layout information

---

### ✅ Page 6: Page 6

**Design Description:**
This design represents the 'Page 6' of a web application, dedicated to managing creative assets. It is designed with a dark theme and a left-side navigation. The main content area displays a grid of asset previews along with options to filter and manage the assets. The design emphasizes a clean, professional aesthetic with a focus on usability.
**Overall Layout:**
The page is structured using a flexbox layout. The main container has a width of 1440px, and a height to fit the content. It's divided into two main sections: a left sidebar (width: 240px) for navigation and a main content area (width: 1200px) on the right. A top navigation bar spans the entire width of the container. The content area consists of asset display, a header with filtering and creation options, and a pagination section.
**Top Navigation Bar:**
The top navigation bar has a height of 60px and a background color of #121829. It includes the 'BestAds' logo (font: 700, size: 24px, color: #FFFFFF) on the left with margin-left: 20px. The middle section is empty. On the right, there are two dropdowns: 'English' and a user avatar, each with a height of 32px. The dropdowns are aligned to the right with margin-right: 20px.
**Left Sidebar Navigation:**
The left sidebar has a fixed width of 240px and extends to the full height of the page. The background color is #121829. The sidebar contains navigation links with text color #FFFFFF, font size 14px, and font weight 400. The selected item ('创意') has a background color of #19A974.
**Main Content Area:**
The main content area is located on the right side of the page. It contains the following sections:
*   **Header Section:** This section includes a search bar and several buttons for asset management. The '所有搜索条件' (All Search Conditions) dropdown (width: 120px, height: 32px, border-radius: 4px, background: #1E2438, text color: #FFFFFF) is located to the left of the search input. The search input (width: 240px, height: 32px, border-radius: 4px, background: #1E2438, text color: #FFFFFF) contains the placeholder text '请输入素材名称' (Please Enter Material Name). To the right is a 'Q 查询' (Q Search) button (width: 60px, height: 32px, border-radius: 4px, background: #19A974, text color: #FFFFFF, font-weight: 500). Below the search bar are action buttons like '上传新素材' (Upload New Material), '同步媒体素材' (Synchronize Media Material), '授权Tik tok帖子' (Authorize Tik tok Post) with a background color of #1E2438. Each has padding of 8px 16px and a border radius of 4px. Finally, there is a clock icon labelled '上传历史' (Upload History).

**Route Configuration:**
- Route: `/page-6`
- Page component: `Page6Page`

**Layout Notes:**
The page is structured with a top navigation bar, a left sidebar navigation (240px width) and a main content area. The main content area is laid out using a grid system for the assets and a flexbox layout for header elements. The pagination is located at the bottom of the page. Total width of the page is 1440px.

---

## 🎨 Design System

### Color Palette
Use these colors consistently throughout your application:

- **Primary Background:** `#1E293B`
- **Secondary Background:** `#334155`
- **Primary Text:** `#FFFFFF`
- **Secondary Text:** `#CBD5E1`
- **Accent Color:** `#4ADE80`
- **Background Dark:** `#0E151E`
- **Sidebar Background:** `#151E29`
- **Text White:** `#FFFFFF`
- **Text Grey:** `#9DA9B3`
- **Active Item Background:** `#222B3A`
- **Search Bar Background:** `#1C2532`
- **Primary Button Green:** `#52C41A`
- **Primary Green:** `#1BBF79`
- **Text Gray:** `#A3AED0`
- **Border Color:** `#2D374B`
- **Background:** `#0E151E`
- **Main Content Background:** `#161D28`
- **Card Background:** `#1A202C`
- **Input Background:** `#2D3748`
- **Primary Button:** `#68D391`
- **Secondary Button:** `#3182CE`
- **Primary:** `#3b82f6`
- **Text:** `#111827`
- **Accent:** `#8b5cf6`

### Typography System
A sans-serif font family is used throughout the page. Font sizes vary from 12px to 24px, with font weights ranging from 400 to 600.

### Spacing Guidelines
A consistent spacing scale of 8px, 16px, and 24px is used for margins and padding throughout the page.

## 🧭 Navigation Implementation

Create a consistent navigation system that includes:

### Main Navigation Menu
- **Page 1** (Home)
- **Page 2**
- **Page 3**
- **Page 4**
- **Page 5**
- **Page 6**

### Navigation Features
- Clear visual indication of the current active page
- Responsive design that works on all device sizes
- Smooth transitions between pages
- Consistent placement across all pages (header or sidebar)

## ⚙️ Technical Implementation

### Required Setup
1. **Router Configuration:** Use React Router for navigation between pages
2. **Shared Layout:** Create a common layout component with consistent header/navigation
3. **State Management:** Implement shared state for data used across multiple pages
4. **Component Library:** Use consistent UI components and styling

### Route Structure
```
/ → Page 1Page (Home)
/page-2 → Page2Page
/page-3 → Page3Page
/page-4 → Page4Page
/page-5 → Page5Page
/page-6 → Page6Page
```

## 🌟 Best Practices & Recommendations

### User Experience
- ✅ Implement loading states when navigating between pages
- ✅ Add breadcrumbs for complex navigation paths
- ✅ Ensure fast page transitions and smooth animations
- ✅ Maintain scroll position or reset appropriately

### Performance
- ✅ Implement code splitting for each page component
- ✅ Optimize images and assets for web
- ✅ Use lazy loading for non-critical components
- ✅ Cache frequently accessed data

### Accessibility
- ✅ Ensure proper heading hierarchy on each page
- ✅ Implement skip links for keyboard navigation
- ✅ Use semantic HTML elements consistently
- ✅ Test with screen readers and keyboard-only navigation

### Responsive Design
- ✅ Mobile-first approach for all pages
- ✅ Consistent breakpoints across the application
- ✅ Touch-friendly interactive elements
- ✅ Optimized navigation for small screens

## 🎯 Getting Started

1. Start with the basic routing structure and navigation
2. Implement the Page 1 page first as your foundation
3. Build each additional page one at a time
4. Test navigation flow between all pages
5. Polish the design and add any advanced features

Remember: This is a living guide! Feel free to adapt these specifications to match your exact needs and brand requirements. Good luck building your amazing web application! 🚀


Detected Elements
1 Logo: [object Object]
10 Navigation Link: [object Object]
1 Search Input: [object Object]
2 Dropdown: [object Object]
1 Search Button: [object Object]
8 Table Header: [object Object]
10 Table Row: [object Object]
10 Status Button: [object Object]
10 Action Button: [object Object]
1 Pagination: [object Object]
1 Avatar: [object Object]
1 Button: [object Object]
1 Logo: [object Object]
10 Navigation Item: [object Object]
2 Header Title: [object Object]
2 Dropdown Select: [object Object]
1 Input Field: [object Object]
4 Button: [object Object]
3 Asset Card: [object Object]
1 Pagination: [object Object]
1 Upload Modal: [object Object]
1 File Upload Area: [object Object]
1 Top Navigation Bar: The top navigation bar spans the entire width of the page. It includes a logo on the left, a title '创意' (Creative), and user controls on the right. The user controls include a language dropdown ('English') and a user avatar with a dropdown menu. Height: 64px. Background color: #121829.  Padding-left: 24px, Padding-right: 24px.
1 Left Sidebar: The left sidebar is a fixed-width navigation menu. It contains navigation links such as '广告投放' (Ad Delivery), 'Facebook', '● 数据分析' (Data Analysis), '广告报表' (Ad Reports), '资产管理' (Asset Management), '账户' (Account), '创意' (Creative - Current Page Highlighted), '余额管理' (Balance Management), '目记录管理' (Record Management), '品服务工具' (Service Tools), and folder/category links such as '素材库' (Material Library). The active item ('创意') has a background color of #1BBF79 with 0.1 opacity. Width: 220px. Background color: #121829.
1 Search Bar: A search bar with a dropdown for search scope ('所有搜索条件' - All Search Terms) and an input field with the placeholder text '请输入素材名称' (Enter Material Name). It also features a search icon button 'Q 查询' (Search).
3 Buttons: There are 3 primary green buttons: '上传新素材' (Upload New Material) and '同步媒体素材' (Sync Media Material). There's also an '上传历史' (Upload History) button. Background color: #1BBF79.
1 File Management Section: This section includes a search bar '搜索文件夹名称' (Search Folder Name), a 'Q' (search) button, a '+ 新建文件夹' (+ New Folder) button, '上传素材到媒体' (Upload Material to Media) button, '批量操作' (Batch Operation) button, '全选当前页' (Select All on Current Page), '已选2项' (2 Selected), '取消选择' (Cancel Selection), and a sort dropdown '按创建时间从新到旧排序' (Sort by Creation Time Newest to Oldest).
4 Image Cards: Four image cards, each displaying a thumbnail (1920*1080). Each has a checkbox on the top-left, a filename 'Tec-do20.png', and several social media icons along the bottom.
1 Pagination: Pagination controls at the bottom: '共1页' (Total 1 Page), a dropdown '50/页' (50/Page), '<', '1', '>', and '前往 1 页' (Go to Page 1).
13 Folder Navigation: Located in the left sidebar. These include '袜子普货-商品主图' (Socks Common Goods - Product Main Picture), '袜子定制款AA-详情图' (Socks Customized AA-Detail Picture), '内裤定制主图' (Underwear Customized Main Picture), '加码素材' (Plus Size Material), '男士夏季T恤服装' (Men's Summer T-Shirt Clothing), '男士沙滩定制T恤' (Men's Beach Custom T-Shirt), '夏威夷沙滩裤' (Hawaiian Beach Pants), '男士衣服帽' (Men's Clothing Cap), '女士夏季服饰' (Women's Summer Clothing), '青少年服饰定制款' (Youth Clothing Custom Style), '家具毛毯图片' (Furniture Blanket Picture), '定制化浴帘商品图' (Customized Shower Curtain Product Picture), '连衣裙普货款衣服' (Dress Common Goods Style Clothing), '万圣节恐怖装饰' (Halloween Horror Decoration), '感恩节挂饰图片' (Thanksgiving Ornament Picture), '其它配饰图片' (Other Accessories Picture). They include right angle brackets to indicate expandable sections
9 Sidebar Navigation Link: Each link is 240px wide, 40px tall, with 10px left/right padding. The text color is #A0AEC0 on default, #FFFFFF on hover. The active link has a background color of #2D3748 and white text. Left margin 20px.
2 Top Navigation Select: Width: Auto, Height: Auto. Background: #2D3748, Text Color: #A0AEC0, Border Radius: 5px, Padding: 8px 12px. English select on the right, All search condition select on the left.
1 Top Navigation Input: Width: 200px, Height: Auto. Background: #2D3748, Text Color: #A0AEC0, Border Radius: 5px, Padding: 8px 12px. Placeholder text is '请输入素材名称'.
1 Top Navigation Button: Background: #3182CE, Text Color: #FFFFFF, Border Radius: 5px, Padding: 8px 16px, Text: 'Q 查询'.
1 User Avatar: Width: 30px, Height: 30px, Border Radius: 50%, Object-fit: cover.
5 Content Filter Button: Padding: 8px 16px, Border Radius: 5px. 'Facebook' button is green(#68D391), others are blue (#3182CE) except last which has an icon.
2 Image Item: Each item contains an image (width 100%), image details (metadata and icons).
1 Pagination Select: Text color: #A0AEC0, background: #2D3748, Padding: 5px 10px, border radius: 5px. value is '50/页'
4 Pagination Button: Text color: #A0AEC0, background: #2D3748, Padding: 5px 10px, border radius: 5px. '<' is disabled.  text is '1', '>' and '前往'
1 Pagination Input: width: 40px, padding: 8px, border: 1px solid #2D3748, background: #2D3748, color: #A0AEC0, border-radius: 5px, margin: 0 5px. Value is '1'.
1 Modal Overlay: Full screen overlay with background color rgba(0, 0, 0, 0.5).
1 Modal: Width: 500px, Padding: 20px, Background: #1A202C, Border Radius: 5px.
1 Modal Header: Contains title '同步媒体素材' and close button (X).
4 Modal Body Label: Text color: #A0AEC0, Font size: 14px. Labels are '*投放开始日期', '*同步类型', '*选择广告账户', '*目标位置'
2 Modal Radio Button: For the *同步类型 section, named 'syncType'.
1 Modal Select: Text color: #A0AEC0, Background: #2D3748, Border radius: 5px, Padding: 8px.  Option: '请选择最多10个账户'
1 Modal Text Input: Background: #2D3748, text Color: #A0AEC0, border radius: 5px, Padding: 8px, Placeholder '搜索文件夹位置'.
3 Modal List Item: List items with '> ' before text. Items are: '广告测试2组', '广告测试1组', '广告测试3组'.
2 Modal Footer Button: One button '取消', One button '确定' (primary).
1 Layout Container: Main container holding all UI elements
1 Content Area: Primary content section
1 UI Components: Various UI components as described in the prompt
1 Top Navigation Bar: Height: 60px, Background Color: #121829, Contains logo and user profile elements.
1 Logo: Text: 'BestAds', Font: 700, Size: 24px, Color: #FFFFFF, margin-left: 20px
2 Dropdown: Text: 'English', User Avatar, Height: 32px, Aligned to right, margin-right: 20px
1 Left Sidebar Navigation: Width: 240px, Background Color: #121829, Contains navigation links, Selected item background color: #19A974
9 Navigation Link: Text Color: #FFFFFF, Font Size: 14px, Font Weight: 400, Padding: 12px 20px
1 Search Bar: Width: 240px, Height: 32px, Border-radius: 4px, Background: #1E2438, Text color: #FFFFFF, Placeholder Text: '请输入素材名称'
1 Dropdown Button: Text: '所有搜索条件', Width: 120px, Height: 32px, Border-radius: 4px, Background: #1E2438, Text Color: #FFFFFF
6 Button: Text: '上传新素材', '同步媒体素材', '授权Tik tok帖子','+ 新建文件夹', '上传素材到媒体', '批量操作', Width varies, Height: 32px, Border-radius: 4px, Background: #1E2438 or #19A974, Text Color: #FFFFFF
11 Asset Folder: Text: '素材库', '袜子普货-商品主图', '袜子定制款AA-详情图', ..., '其它配饰图片', Font Size: 14px, Font Weight: 400, Text Color: #FFFFFF
3 Asset Card: Width: 240px, Height: 200px, Background: #1E2438, Contains placeholder image and asset name, Spacing: 20px horizontal, 20px vertical
3 Asset Name: Text: '广告测试3组', '广告测试2组', '广告测试1组', Font Size: 12px, Font Weight: 400, Text Color: #FFFFFF
1 Pagination: Text: '共1页', '50/页', '<', '1', '>', '前往', '页', Dropdown for items per page, Previous/Next page arrows, Current page number
4 Icon: Search, Folder,  Sorting , Grid

Color Palette
Primary Background: #1E293B
Secondary Background: #334155
Primary Text: #FFFFFF
Secondary Text: #CBD5E1
Accent Color: #4ADE80
Background Dark: #0E151E
Sidebar Background: #151E29
Text White: #FFFFFF
Text Grey: #9DA9B3
Active Item Background: #222B3A
Search Bar Background: #1C2532
Primary Button Green: #52C41A
Primary Green: #1BBF79
Text Gray: #A3AED0
Border Color: #2D374B
Background: #0E151E
Main Content Background: #161D28
Card Background: #1A202C
Input Background: #2D3748
Primary Button: #68D391
Secondary Button: #3182CE
Primary: #3b82f6
Text: #111827
Accent: #8b5cf6

Layout Information
Multi-page web application layout with enhanced navigation

Spacing Details
A consistent spacing scale of 8px, 16px, and 24px is used for margins and padding throughout the page.

Typography Specifications
A sans-serif font family is used throughout the page. Font sizes vary from 12px to 24px, with font weights ranging from 400 to 600.

---

## Tips for Implementation:
1. Start by creating the main layout structure
2. Implement components one by one, starting with the most basic ones
3. Use the detected color palette for consistent styling
4. Follow the spacing and typography guidelines provided
5. Test responsive behavior on different screen sizes

## Recommended File Structure:
```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   └── [your-components]
└── lib/
    └── utils.ts
```