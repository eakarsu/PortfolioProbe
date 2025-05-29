import { 
  menuItems, 
  orders, 
  contactMessages,
  type MenuItem, 
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type ContactMessage,
  type InsertContactMessage 
} from "@shared/schema";

export interface IStorage {
  // Menu items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  
  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private contactMessages: Map<number, ContactMessage>;
  private currentMenuId: number;
  private currentOrderId: number;
  private currentMessageId: number;

  constructor() {
    this.menuItems = new Map();
    this.orders = new Map();
    this.contactMessages = new Map();
    this.currentMenuId = 1;
    this.currentOrderId = 1;
    this.currentMessageId = 1;
    
    // Initialize with sample menu items
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    const sampleItems: Omit<MenuItem, 'id'>[] = [
      // Appetizers
      {
        name: "Bruschetta Trio",
        description: "Three varieties: classic tomato basil, mushroom truffle, and goat cheese fig",
        price: "14.99",
        image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "appetizers",
        tags: [],
        available: true
      },
      {
        name: "Crispy Calamari",
        description: "Fresh squid rings with spicy marinara and lemon aioli",
        price: "16.99",
        image: "https://images.unsplash.com/photo-1559847844-d721426d6edc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "appetizers",
        tags: [],
        available: true
      },
      // Main Courses
      {
        name: "Grilled Atlantic Salmon",
        description: "Fresh salmon fillet with seasonal vegetables and lemon herb butter",
        price: "28.99",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        tags: [],
        available: true
      },
      {
        name: "Truffle Mushroom Pasta",
        description: "Handmade pasta with wild mushrooms, truffle oil, and parmesan",
        price: "24.99",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        tags: ["vegetarian"],
        available: true
      },
      {
        name: "Wagyu Beef Tenderloin",
        description: "Premium wagyu beef with roasted potatoes and seasonal vegetables",
        price: "45.99",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        tags: [],
        available: true
      },
      {
        name: "Prime Ribeye Steak",
        description: "12oz aged ribeye with garlic mashed potatoes and grilled asparagus",
        price: "42.99",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        tags: [],
        available: true
      },
      {
        name: "Wild Mushroom Risotto",
        description: "Creamy arborio rice with seasonal mushrooms and truffle oil",
        price: "26.99",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        tags: ["vegetarian"],
        available: true
      },
      {
        name: "Duck Confit",
        description: "Slow-cooked duck leg with cherry gastrique and roasted root vegetables",
        price: "34.99",
        image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        tags: [],
        available: true
      },
      {
        name: "Quinoa Power Bowl",
        description: "Nutritious quinoa with roasted vegetables, avocado, and tahini dressing",
        price: "18.99",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        tags: ["vegetarian", "vegan"],
        available: true
      },
      {
        name: "Signature Beef Burger",
        description: "Grass-fed beef patty with caramelized onions, aged cheddar, and truffle fries",
        price: "22.99",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "mains",
        tags: [],
        available: true
      },
      // Desserts
      {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center, served with vanilla ice cream",
        price: "12.99",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "desserts",
        tags: [],
        available: true
      },
      {
        name: "Seasonal Berry Tart",
        description: "Almond crust with cashew cream and fresh seasonal berries",
        price: "10.99",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "desserts",
        tags: ["vegan"],
        available: true
      }
    ];

    sampleItems.forEach(item => {
      const id = this.currentMenuId++;
      this.menuItems.set(id, { ...item, id });
    });
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.available);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      item => item.available && item.category === category
    );
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuId++;
    const item: MenuItem = { ...insertItem, id };
    this.menuItems.set(id, item);
    return item;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { ...insertOrder, id };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentMessageId++;
    const message: ContactMessage = { ...insertMessage, id };
    this.contactMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
