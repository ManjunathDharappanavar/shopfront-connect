import React, { createContext, useContext, useEffect, useState } from 'react';
import { cartAPI } from '@/services/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  _id: string;
  userid: string;
  productid: {
    _id: string;
    productname: string;
    price: number;
    image: string;
    stock_available: number;
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  totalAmount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (cartId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const cartCount = cartItems.length;
  const totalAmount = cartItems.reduce((total, item) => total + (item.productid.price * item.quantity), 0);

  const fetchCart = async () => {
    if (!user?._id) return;
    
    try {
      setIsLoading(true);
      const response = await cartAPI.getCartOfUser(user._id);
      setCartItems(response.cart || []);
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user?._id) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await cartAPI.addToCart(user._id, productId, quantity);
      await fetchCart();
      toast({
        title: "Added to Cart",
        description: "Item added to your cart successfully",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Add",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const updateCartItem = async (cartId: string, quantity: number) => {
    try {
      await cartAPI.updateCart(cartId, quantity);
      await fetchCart();
      toast({
        title: "Cart Updated",
        description: "Item quantity updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (cartId: string) => {
    try {
      await cartAPI.deleteCart(cartId);
      await fetchCart();
      toast({
        title: "Item Removed",
        description: "Item removed from cart successfully",
      });
    } catch (error: any) {
      toast({
        title: "Remove Failed",
        description: error.message || "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    if (user?._id) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user?._id]);

  const value = {
    cartItems,
    cartCount,
    totalAmount,
    isLoading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};