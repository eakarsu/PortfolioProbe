import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, Award, Heart, Brain, Leaf, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { getAIRecommendations, type AIRecommendation } from "@/lib/openai";
import type { MenuItem } from "@shared/schema";

export default function HomePage() {
  const { dispatch } = useCart();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  // Fetch featured dishes (first 3 main courses)
  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const featuredDishes = menuItems?.filter(item => item.category === "mains").slice(0, 3) || [];

  // Get AI recommendations on component mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recs = await getAIRecommendations({
          preferences: "healthy options and popular dishes",
          previousOrders: "",
        });
        setRecommendations(recs);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleAddToCart = (item: MenuItem | AIRecommendation) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        price: parseFloat(item.price.toString()),
        image: item.image,
      },
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-96 md:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Culinary Excellence<br />
              <span className="text-accent">Delivered Fresh</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Experience gourmet dining from the comfort of your home with our chef-crafted dishes and premium ingredients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/menu">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Explore Menu
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary">
                View Offers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Featured Dishes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our chef's signature creations, made with the finest ingredients and culinary expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredDishes.map((dish) => (
                <Card key={dish.id} className="overflow-hidden hover:shadow-2xl transition-shadow">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-secondary mb-2">{dish.name}</h3>
                    <p className="text-gray-600 mb-4">{dish.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${dish.price}</span>
                      <Button
                        onClick={() => handleAddToCart(dish)}
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              <Brain className="inline-block mr-3 text-primary" />
              AI Recommended For You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our intelligent system learns your preferences to suggest dishes you'll love.
            </p>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recommendations.slice(0, 2).map((rec, index) => (
                <Card key={rec.id} className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      {index === 0 ? (
                        <Leaf className="h-6 w-6 text-white" />
                      ) : (
                        <Star className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary">
                        {index === 0 ? "Healthy Choice" : "Popular Pick"}
                      </h3>
                      <p className="text-sm text-gray-600">{rec.reason}</p>
                    </div>
                  </div>
                  <img
                    src={rec.image}
                    alt={rec.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h4 className="font-semibold text-secondary mb-2">{rec.name}</h4>
                  <p className="text-gray-600 text-sm mb-4">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">${rec.price}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(rec)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center mb-4">
                    <Skeleton className="w-12 h-12 rounded-full mr-4" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="w-full h-32 rounded-lg mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Clock className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-300">Fresh meals delivered in 30-45 minutes or less</p>
            </div>
            <div>
              <Award className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Chef Quality</h3>
              <p className="text-gray-300">Every dish crafted by our award-winning culinary team</p>
            </div>
            <div>
              <Heart className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-300">Locally sourced, organic ingredients in every meal</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
