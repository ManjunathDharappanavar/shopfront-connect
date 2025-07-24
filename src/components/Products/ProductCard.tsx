import React from 'react';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

interface Product {
  _id: string;
  productname: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock_available: number;
  isactive: boolean;
  reviews: any[];
}

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product._id, 1);
  };

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-large hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.productname}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.stock_available < 10 && product.stock_available > 0 && (
          <Badge className="absolute top-2 left-2 bg-warning text-white">
            Low Stock
          </Badge>
        )}
        {product.stock_available === 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive">
            Out of Stock
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onViewDetails(product)}
            className="transform scale-90 group-hover:scale-100 transition-transform duration-300"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
              {product.productname}
            </h3>
            <Badge variant="outline" className="ml-2 text-xs">
              {product.category}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews.length} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.stock_available} in stock
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-x-2">
        <Button
          onClick={() => onViewDetails(product)}
          variant="outline"
          className="flex-1"
        >
          View Details
        </Button>
        <Button
          onClick={handleAddToCart}
          variant="cart"
          disabled={product.stock_available === 0}
          className="flex-1"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;