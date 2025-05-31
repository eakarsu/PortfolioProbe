import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import CustomizationModal from "@/components/CustomizationModal";

// Helper function to get food image based on item name and category
const getFoodImage = (itemName: string, categoryName: string): string => {
  const name = itemName.toLowerCase();
  const category = categoryName.toLowerCase();
  
  // Acai Bowls
  if (category.includes("acai")) return "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop&auto=format";
  
  // Beverages
  if (category.includes("bottled") || category.includes("drink")) {
    if (name.includes("coke") || name.includes("pepsi") || name.includes("sprite")) return "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop&auto=format";
    if (name.includes("water")) return "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop&auto=format";
    if (name.includes("juice")) return "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&auto=format";
    if (name.includes("gatorade")) return "https://images.unsplash.com/photo-1594736797933-d0651ba87360?w=400&h=300&fit=crop&auto=format";
    if (name.includes("monster") || name.includes("red bull")) return "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop&auto=format";
    if (name.includes("snapple")) return "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop&auto=format";
  }
  
  // Breakfast items
  if (category.includes("breakfast") || category.includes("omelet")) {
    if (name.includes("french toast")) return "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop&auto=format";
    if (name.includes("omelet")) return "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop&auto=format";
    if (name.includes("bagel")) return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format";
    if (name.includes("wrap")) return "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop&auto=format";
  }
  
  // Sandwiches
  if (category.includes("sandwich") || category.includes("hero") || category.includes("panini")) {
    if (name.includes("chicken")) return "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop&auto=format";
    if (name.includes("roast beef")) return "https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=400&h=300&fit=crop&auto=format";
    if (name.includes("turkey")) return "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop&auto=format";
    if (name.includes("italian")) return "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop&auto=format";
  }
  
  // Chips
  if (category.includes("chips")) return "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop&auto=format";
  
  // Salads
  if (category.includes("salad")) return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format";
  
  // Coffee
  if (category.includes("coffee")) return "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&auto=format";
  
  // Tea
  if (category.includes("tea")) return "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format";
  
  // Desserts
  if (category.includes("dessert") || name.includes("cookie") || name.includes("pudding")) {
    if (name.includes("cookie")) return "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&auto=format";
    if (name.includes("pudding")) return "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&auto=format";
    return "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&auto=format";
  }
  
  // Default food image
  return "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&auto=format";
};

interface CategoryItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface RuleOption {
  name: string;
  price: number;
  size: string;
}

interface Rule {
  name: string;
  type: "select_one" | "select_multiple";
  max_selections?: number;
  options: RuleOption[];
}

interface Category {
  name: string;
  image: string;
  hasRules?: boolean;
  rules?: Rule[];
  items: CategoryItem[];
}

// Rules data from rules.txt
const rulesData: Record<string, Rule[]> = {
  "BYO Breakfast": [
    {
      name: "Bagel Options",
      type: "select_one",
      options: [
        { name: "Plain", price: 1.50, size: "Small" },
        { name: "Everything", price: 1.50, size: "Small" },
        { name: "Sesame", price: 1.50, size: "Small" },
        { name: "Whole Wheat", price: 1.50, size: "Small" }
      ]
    },
    {
      name: "Bagel Spreads",
      type: "select_multiple",
      max_selections: 3,
      options: [
        { name: "Butter", price: 1.00, size: "Small" },
        { name: "Cream Cheese", price: 2.00, size: "Small" },
        { name: "Bacon", price: 4.00, size: "Small" },
        { name: "Lox", price: 6.00, size: "Small" }
      ]
    }
  ],
  "BYO Sandwiches": [
    {
      name: "Bread",
      type: "select_one",
      options: [
        { name: "Hero", price: 1.00, size: "Medium" },
        { name: "Roll", price: 0.00, size: "Medium" },
        { name: "White Wrap", price: 1.00, size: "Medium" },
        { name: "Whole Wheat Wrap", price: 1.00, size: "Medium" }
      ]
    },
    {
      name: "Protein",
      type: "select_multiple",
      max_selections: 2,
      options: [
        { name: "Grilled chicken", price: 2.00, size: "Medium" },
        { name: "Turkey", price: 2.00, size: "Medium" },
        { name: "Ham", price: 2.00, size: "Medium" },
        { name: "Roast beef", price: 3.00, size: "Medium" }
      ]
    },
    {
      name: "Toppings",
      type: "select_multiple",
      max_selections: 5,
      options: [
        { name: "Lettuce", price: 1.00, size: "Medium" },
        { name: "Tomato", price: 1.00, size: "Medium" },
        { name: "Onion", price: 0.75, size: "Medium" },
        { name: "Cheese", price: 1.00, size: "Medium" },
        { name: "Avocado", price: 1.50, size: "Medium" }
      ]
    }
  ],
  "Chopped Salad": [
    {
      name: "Salad Base",
      type: "select_one",
      options: [
        { name: "Mixed Greens", price: 0.00, size: "Small" },
        { name: "Romaine", price: 0.00, size: "Small" },
        { name: "Spinach", price: 0.00, size: "Small" }
      ]
    },
    {
      name: "Add-ons",
      type: "select_multiple",
      max_selections: 5,
      options: [
        { name: "Grilled chicken", price: 2.00, size: "Small" },
        { name: "Feta cheese", price: 2.00, size: "Small" },
        { name: "Tomatoes", price: 0.50, size: "Small" },
        { name: "Cucumber", price: 0.50, size: "Small" },
        { name: "Croutons", price: 0.50, size: "Small" }
      ]
    }
  ],
  "Coffee": [
    {
      name: "Coffee Creamers",
      type: "select_one",
      options: [
        { name: "Milk", price: 0.00, size: "Small" },
        { name: "Half and Half", price: 0.00, size: "Small" },
        { name: "French Vanilla", price: 0.00, size: "Small" },
        { name: "Hazelnut", price: 0.00, size: "Small" }
      ]
    }
  ]
};

// Category data extracted from prompt2.txt
const categoriesData: Category[] = [
  {
    name: "Acai Bowls",
    image: "🥣",
    items: [
      { id: 1, name: "Acai Bowl", price: 12.97, description: "Acai, Banana, Blueberry, Strawberry, Granola, Coconut, Honey" }
    ]
  },
  {
    name: "Bottled Drinks",
    image: "🥤",
    items: [
      { id: 2, name: "Apple Juice", price: 3.59 },
      { id: 3, name: "Arizona Iced Cold Brew Green Tea", price: 4.09 },
      { id: 4, name: "Coke 20oz soda", price: 3.59 },
      { id: 5, name: "Diet Coke 20oz soda", price: 3.59 },
      { id: 6, name: "Pepsi 20oz soda", price: 3.59 },
      { id: 7, name: "Sprite 20oz soda", price: 3.59 },
      { id: 8, name: "Gatorade Cool Blue", price: 3.59 },
      { id: 9, name: "Gatorade Fruit Punch", price: 3.59 },
      { id: 10, name: "Monster", price: 3.50 },
      { id: 11, name: "Red Bull 8.4 oz.", price: 2.95 },
      { id: 12, name: "Poland Spring Water 1 L", price: 4.23 },
      { id: 13, name: "Orange Juice", price: 3.59, description: "OJ" },
      { id: 14, name: "Snapple 16 oz Peach Tea", price: 2.75 }
    ]
  },
  {
    name: "Breakfast Combos",
    image: "🍳",
    items: [
      { id: 15, name: "French Toast", price: 9.95, description: "Texas style french toast served with butter and syrup" },
      { id: 16, name: "Healthy One", price: 11.64, description: "Three egg whites, turkey, spinach, Alpine Lace Swiss, in a whole wheat wrap." },
      { id: 17, name: "Hungry Man", price: 12.95, description: "Three eggs, ham, bacon, sausage, and cheese on a hero." },
      { id: 18, name: "Melville Platter", price: 12.95, description: "Two eggs, ham, bacon, sausage, home-fries, and toast." },
      { id: 19, name: "Protein Slammer", price: 12.94, description: "Five egg whites, extra turkey, Alpine Lace Swiss cheese, on a whole wheat wrap." },
      { id: 20, name: "Super Thing", price: 12.94, description: "Two eggs, extra bacon, extra sausage, onions, and American cheese." }
    ]
  },
  {
    name: "BYO Breakfast",
    image: "🥯",
    hasRules: true,
    rules: rulesData["BYO Breakfast"],
    items: [
      { id: 21, name: "Bagel", price: 0.00, description: "Build your own bagel with spreads" },
      { id: 22, name: "Breakfast", price: 2.60, description: "Build your own breakfast with eggs, meat, and more" }
    ]
  },
  {
    name: "BYO Sandwiches",
    image: "🥪",
    hasRules: true,
    rules: rulesData["BYO Sandwiches"],
    items: [
      { id: 23, name: "BYO Sandwiches", price: 16.00, description: "Build your own sandwich with bread, protein, cheese, and toppings" }
    ]
  },
  {
    name: "Chips",
    image: "🍟",
    items: [
      { id: 24, name: "Classic Lays", price: 3.24 },
      { id: 25, name: "Cool Ranch Doritos", price: 3.24 },
      { id: 26, name: "Nacho Cheese Doritos", price: 3.24 },
      { id: 27, name: "Spicy Sweet Chili Doritos", price: 3.24 }
    ]
  },
  {
    name: "Chopped Salad",
    image: "🥗",
    hasRules: true,
    rules: rulesData["Chopped Salad"],
    items: [
      { id: 28, name: "BYO Salad", price: 9.95, description: "Build your own salad with fresh ingredients" }
    ]
  },
  {
    name: "Coffee",
    image: "☕",
    hasRules: true,
    rules: rulesData["Coffee"],
    items: [
      { id: 29, name: "Cappuccino, Large", price: 2.76 },
      { id: 30, name: "Cappuccino, Medium", price: 2.25 },
      { id: 31, name: "Cappuccino, Small", price: 1.76 },
      { id: 32, name: "Columbian Coffee, Large", price: 2.76 },
      { id: 33, name: "Columbian Coffee, Medium", price: 2.25 },
      { id: 34, name: "Columbian Coffee, Small", price: 1.76 }
    ]
  },
  {
    name: "Tea",
    image: "🍵",
    items: [
      { id: 35, name: "Green Tea, Large", price: 2.76 },
      { id: 36, name: "Green Tea, Medium", price: 2.25 },
      { id: 37, name: "Green Tea, Small", price: 1.76 },
      { id: 38, name: "Hot Tea, Large", price: 2.76 },
      { id: 39, name: "Hot Tea, Medium", price: 2.25 },
      { id: 40, name: "Hot Tea, Small", price: 1.76 }
    ]
  },
  {
    name: "Cold Sandwiches",
    image: "🥙",
    items: [
      { id: 41, name: "Balsamic Avocado Hero", price: 17.95, description: "Turkey breast, avocado, tomato, romaine lettuce and balsamic vinaigrette." },
      { id: 42, name: "California Hero", price: 17.95, description: "Turkey breast, avocado, lettuce, tomatoes and Russian dressing." },
      { id: 43, name: "Italian Hero", price: 17.95, description: "Capicola ham, salami, pepperoni, lettuce, tomato, Provolone cheese and Italian dressing on a hero" },
      { id: 44, name: "Turkey Club Hero", price: 17.95, description: "Roast turkey breast, bacon, lettuce, tomato and mayo on a hero." },
      { id: 45, name: "Roast Beef Deluxe Hero", price: 17.95, description: "Roast beef, bacon, Cheddar, lettuce, tomato and mayo." }
    ]
  },
  {
    name: "Desserts",
    image: "🍪",
    items: [
      { id: 46, name: "Chocolate Chip Cookies", price: 2.29 },
      { id: 47, name: "Chocolate Pudding", price: 3.89 },
      { id: 48, name: "Rice Pudding", price: 4.54 }
    ]
  },
  {
    name: "Grill Menu",
    image: "🔥",
    items: [
      { id: 49, name: "Beef gyro", price: 12.94, description: "Lettuce, tomato, cucumbers, onions, gyro sauce." },
      { id: 50, name: "Cuban Sandwich", price: 18.12, description: "Pulled pork, ham, Swiss cheese, pickles and tomatoes on a garlic bread hero." },
      { id: 51, name: "Falafel Wrap", price: 11.64, description: "Falafel, lettuce, onion, cucumber, tomato and tahini sauce." },
      { id: 52, name: "Philly Cheese Steak", price: 14.24, description: "Tender rib-eye steak, sautéed peppers, onions, and mixed Cheese." },
      { id: 53, name: "Wrap Supreme", price: 11.64, description: "Chicken tenders, lettuce, tomato, cheese, and ranch dressing." }
    ]
  },
  {
    name: "Hot Sandwiches",
    image: "🌭",
    items: [
      { id: 54, name: "Chicken Fiesta Hero", price: 17.95, description: "Fried chicken cutlet, fresh mozzarella, roasted red peppers and spicy mayo on a toasted hero." },
      { id: 55, name: "Texas Hero", price: 17.95, description: "Fried chicken cutlet, bacon, fried onions, Mozzarella, Cheddar and barbeque sauce on a toasted garlic hero." },
      { id: 56, name: "Original Hero", price: 17.95, description: "Fried chicken cutlet, cucumber, lettuce, tomato, Mozzarella, ranch and hot sauce on a toasted hero." },
      { id: 57, name: "Melville Spice Hero", price: 17.95, description: "Fried cajun chicken cutlet, bacon, cheddar cheese, lettuce, tomato, and Russian dressing on a toasted hero." }
    ]
  },
  {
    name: "Iced Tea and Lemonade",
    image: "🧊",
    items: [
      { id: 58, name: "Home-Made Iced Tea, Large", price: 3.50 },
      { id: 59, name: "Home-Made Iced Tea, Medium", price: 2.76 },
      { id: 60, name: "Home-Made Lemonade, Large", price: 3.50 },
      { id: 61, name: "Home-Made Lemonade, Medium", price: 2.76 },
      { id: 62, name: "Unsweetened Iced Tea, Large", price: 3.50 },
      { id: 63, name: "Unsweetened Iced Tea, Medium", price: 2.76 }
    ]
  },
  {
    name: "Muffins & Pastries",
    image: "🧁",
    items: [
      { id: 64, name: "Apple Turnover", price: 3.59 },
      { id: 65, name: "Banana Nut Muffin", price: 3.59 },
      { id: 66, name: "Blueberry Muffin", price: 3.59 },
      { id: 67, name: "Chocolate Chip Muffin", price: 3.59 },
      { id: 68, name: "Corn Muffin", price: 3.59 },
      { id: 69, name: "Croissant", price: 3089.00 },
      { id: 70, name: "Strawberry Cheese Danish", price: 3.59 }
    ]
  },
  {
    name: "Omelets",
    image: "🍳",
    items: [
      { id: 71, name: "American Omelet", price: 10.32, description: "ham, American cheese, and tomato." },
      { id: 72, name: "Mexican Omelet", price: 10.32, description: "mushrooms, tomato, onions, jalapeño, and cheese." },
      { id: 73, name: "Western Omelet", price: 10.32, description: "peppers, onions, and ham." },
      { id: 74, name: "Simon's Omelet", price: 11.64, description: "avocado, spinach, Feta cheese and salsa." }
    ]
  },
  {
    name: "Paninis",
    image: "🥖",
    items: [
      { id: 75, name: "California Panini", price: 15.95, description: "Turkey breast, tomato, avocado, Mozzarella cheese and Russian dressing." },
      { id: 76, name: "Italian Chicken Panini", price: 15.95, description: "Grilled chicken, pesto sauce, roasted red pepper, and fresh mozzarella." },
      { id: 77, name: "Texas Panini", price: 15.95, description: "Fried chicken cutlet, bacon, fried onions, cheddar cheese and barbeque sauce." },
      { id: 78, name: "Tuna Cheddar Panini", price: 15.95, description: "Tuna, Cheddar cheese and tomatoes." }
    ]
  },
  {
    name: "Salads",
    image: "🥗",
    items: [
      { id: 79, name: "Chef Salad", price: 15.95, description: "Mixed lettuce, ham, eggs, turkey, carrots, Cheddar cheese, cucumber, tomatoes and green peppers." },
      { id: 80, name: "Greek Salad", price: 15.95, description: "Romaine lettuce, tomatoes, stuffed grape leaves, green peppers, Feta cheese and black olives." },
      { id: 81, name: "Grilled Chicken Caesar Salad", price: 15.95, description: "Romaine lettuce, tomatoes, grilled chicken, Parmigiano cheese, croutons, and caesar dressing." },
      { id: 82, name: "Santa Fe Salad", price: 15.95, description: "Mixed lettuce, grilled chicken, beans, corn, Cheddar cheese, and crunchy cheese tortilla strips, and Santa Fe dressing." }
    ]
  },
  {
    name: "Sliced Cold Cuts",
    image: "🍖",
    items: [
      { id: 83, name: "American cheese 1 lb.", price: 11.98 },
      { id: 84, name: "Boars Head Turkey 1 lb.", price: 15.98 },
      { id: 85, name: "Boars Head Ham 1 lb.", price: 15.98 },
      { id: 86, name: "House Roast Beef 1 lb.", price: 17.98 },
      { id: 87, name: "Swiss cheese 1 lb.", price: 11.98 },
      { id: 88, name: "Cheddar cheese 1 lb.", price: 11.98 }
    ]
  },
  {
    name: "Snacks & Light Meals",
    image: "🥨",
    items: [
      { id: 89, name: "Yogurt Parfait", price: 6.99 },
      { id: 90, name: "Overnight Oats & Berries", price: 6.99 },
      { id: 91, name: "Peanut Butter & Chocolate Overnight Oats", price: 6.99 },
      { id: 92, name: "Strawberry Yogurt Parfait", price: 6.99 }
    ]
  }
];

export default function CategoriesPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [customizationModal, setCustomizationModal] = useState<{
    isOpen: boolean;
    item?: CategoryItem;
    category?: Category;
  }>({ isOpen: false });
  const { dispatch } = useCart();
  const { toast } = useToast();

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddToCart = (item: CategoryItem, category: Category) => {
    // Check if item has rules (customizable)
    if (category.hasRules && category.rules) {
      setCustomizationModal({
        isOpen: true,
        item,
        category
      });
      return;
    }
    
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: getFoodImage(item.name, category.name)
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Menu Categories
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our complete menu organized by categories. Click on any category to see all available items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map((category) => {
            const isExpanded = expandedCategories.has(category.name);
            
            return (
              <Card key={category.name} className="overflow-hidden">
                <div 
                  className="cursor-pointer p-6 hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(category.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{category.image}</div>
                      <div>
                        <h3 className="text-xl font-bold text-secondary">{category.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {category.items.length} item{category.items.length !== 1 ? 's' : ''}
                          {category.hasRules && " • Customizable"}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="space-y-4">
                      {category.items.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center gap-4 p-4 bg-white rounded-lg border"
                        >
                          <img 
                            src={getFoodImage(item.name, category.name)}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&auto=format";
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-secondary">{item.name}</h4>
                            {item.description && (
                              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                            )}
                            <p className="text-primary font-bold mt-2">${item.price.toFixed(2)}</p>
                          </div>
                          <Button
                            onClick={() => handleAddToCart(item, category)}
                            size="sm"
                            className="ml-4 bg-primary hover:bg-primary/90 flex-shrink-0"
                          >
                            <ShoppingCart size={16} className="mr-1" />
                            {category.hasRules ? "Customize" : "Add"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Customization Modal */}
      {customizationModal.isOpen && customizationModal.item && customizationModal.category && (
        <CustomizationModal
          isOpen={customizationModal.isOpen}
          onClose={() => setCustomizationModal({ isOpen: false })}
          item={customizationModal.item}
          category={customizationModal.category}
          rules={customizationModal.category.rules || []}
          itemImage={getFoodImage(customizationModal.item.name, customizationModal.category.name)}
        />
      )}
    </div>
  );
}