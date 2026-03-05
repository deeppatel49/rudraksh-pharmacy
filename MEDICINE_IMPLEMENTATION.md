# Medicine Data Implementation

## Overview
This implementation integrates medicine data from the `onemg.csv` file into the Rudraksh Pharmacy website, displaying all medicines alongside existing products.

## Files Created/Modified

### New Files Created:
1. **`app/lib/csv-parser.js`** - CSV parsing utilities
   - `parseCSV()` - Parses CSV files into JavaScript objects
   - `cleanPrice()` - Converts price strings to numbers
   - `cleanText()` - Cleans and truncates text

2. **`app/data/medicines.js`** - Medicine data loader
   - `getMedicines()` - Loads and transforms CSV data
   - `getCachedMedicines()` - Returns cached medicine data
   - `categorizeMedicine()` - Automatically categorizes medicines
   - `extractBenefits()` - Extracts benefits from text
   - `getImageUrl()` - Constructs CDN image URLs from Drug_URL

3. **`app/medicine/page.js`** - Dedicated medicine page
   - Displays all medicines from CSV
   - Uses the same ProductGrid component
   - Shows medicine-specific information

4. **`app/components/product-detail-image.jsx`** - Image error handling component
   - Client component for product detail image with fallback
   - Handles CDN image load failures gracefully

### Modified Files:
1. **`app/components/product-grid.jsx`**
   - Added `allProducts` prop to accept custom product lists
   - Updated `MEDICINE_CATEGORIES` to include "Medicine"
   - Enhanced search to include manufacturer names
   - Added image error handling with fallback to default image

2. **`app/products/page.js`**
   - Now loads medicines from CSV alongside regular products
   - Shows total count of medicines
   - Displays combined catalog

3. **`app/products/[id]/page.js`**
   - Updated to fetch from both medicines and products
   - Works with medicine IDs (format: `med-{number}`)
   - Generates static params for all products
   - Uses ProductDetailImage component for error handling

## Data Structure

### CSV Fields Mapped:
- `Drug_Name` → `name`
- `Selling_Price` → `price`
- `Product_Introduction` → `description`
- `Pack_Size` + `Pack_Type` → `packSize`
- `Manufacturer` → `manufacturer`
- `Benefits` → `keyBenefits`
- `How_To_Use` → `usage`
- `Chemical_Class` → `composition`
- `Storage_Conditions` → `storage`
- `Common_Side_Effects` → `precautions`
- `Prescription_Required` → `prescriptionRequired`
- `Therapeutic_Class` → `therapeuticClass`
- `Drug_URL` → `drugUrl` (and used for image generation)

### Medicine Image System:
Images are dynamically generated from the `Drug_URL` field:

1. **Source URL**: CSV contains Drug_URL like `https://www.1mg.com/drugs/aciloc-150-tablet-134660`
2. **Slug Extraction**: Extract the slug from URL path: `aciloc-150-tablet-134660`
3. **CDN Construction**: Build Gumlet CDN URL:
   ```
   https://onemg.gumlet.io/a_ignore,w_380,h_380,c_fit,q_auto,f_auto/cropped/{slug}.jpg
   ```
4. **Error Handling**: If CDN image fails to load, fallback to `/products/default-medicine.svg`

**Implementation**:
- `getImageUrl(drugUrl)` function in `medicines.js` performs URL transformation
- `ProductDetailImage` component handles image load errors on detail pages
- `ProductGrid` component includes `imageErrors` state for grid view fallback

### Medicine Categories:
Medicines are automatically categorized based on `Therapeutic_Class`:
- **OTC**: Respiratory, Gastro, Pain, Derma
- **Medicine**: Anti-infectives, Cardiac, Neuro, Anti-neoplastics, Blood

## Usage

### Accessing Medicine Page:
- Visit `/medicine` for a dedicated medicine catalog
- Visit `/products` for combined products and medicines

### Searching:
- Search works across medicine name, category, description, and manufacturer
- Filter by category using the dropdown

### Product Details:
- Each medicine has a unique ID format: `med-{number}`
- Click any medicine to view detailed information
- All original product features (cart, reviews, etc.) work with medicines

## Key Features

1. **CSV Parsing**: Robust CSV parser handles quoted values and commas within fields
2. **Caching**: Medicine data is cached to improve performance
3. **Categorization**: Automatic categorization based on therapeutic class
4. **Price Handling**: Converts various price formats (with rupee symbol, commas) to numbers
5. **Dynamic Images**: Constructs CDN image URLs from Drug_URL field with fallback handling
6. **Error Handling**: Graceful fallback to default images if CDN images fail to load
7. **Backward Compatible**: Existing products still work alongside new medicines

## Performance
- Medicines are loaded server-side
- Data is cached after first load
- Total products: 782 medicines + existing products

## Future Enhancements
1. Implement prescription upload for prescription-required medicines
2. Add advanced filtering by therapeutic class
3. Integrate with inventory management
4. Add medicine substitutes information (available in CSV)
5. Optimize image loading with progressive placeholders

## Notes
- All prices are in Indian Rupees (₹)
- Prescription required flag is preserved from CSV data
- Stock status is maintained from CSV
- MRP and discount information is preserved
