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
    name: "BYO Breakfast",
    image: "🥯",
    hasRules: true,
    rules: rulesData["BYO Breakfast"],
    items: [
      { id: 78, name: "Custom Bagel", price: 0.00, description: "Build your own bagel with spreads" },
      { id: 79, name: "Custom Breakfast", price: 2.60, description: "Build your own breakfast with eggs, meat, and more" }
    ]
  },
  {
    name: "BYO Sandwiches",
    image: "🥪",
    hasRules: true,
    rules: rulesData["BYO Sandwiches"],
    items: [
      { id: 80, name: "Custom Sandwich", price: 16.00, description: "Build your own sandwich with bread, protein, cheese, and toppings" }
    ]
  },
  {
    name: "Chopped Salad",
    image: "🥗",
    hasRules: true,
    rules: rulesData["Chopped Salad"],
    items: [
      { id: 85, name: "Custom Salad", price: 9.95, description: "Build your own salad with fresh ingredients" }
    ]
  },
  {
    name: "Coffee",
    image: "☕",
    hasRules: true,
    rules: rulesData["Coffee"],
    items: [
      { id: 86, name: "Cappuccino, Large", price: 2.76 },
      { id: 87, name: "Cappuccino, Medium", price: 2.25 },
      { id: 88, name: "Cappuccino, Small", price: 1.76 },
      { id: 89, name: "Columbian Coffee, Large", price: 2.76 },
      { id: 90, name: "Columbian Coffee, Medium", price: 2.25 },
      { id: 91, name: "Columbian Coffee, Small", price: 1.76 }
    ]
  },
  {
    name: "Chips",
    image: "🍟",
    items: [
      { id: 81, name: "Classic Lays", price: 3.24 },
      { id: 82, name: "Cool Ranch Doritos", price: 3.24 },
      { id: 83, name: "Nacho Cheese Doritos", price: 3.24 },
      { id: 84, name: "Spicy Sweet Chili Doritos", price: 3.24 }
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