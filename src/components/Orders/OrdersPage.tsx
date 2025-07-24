import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, CreditCard, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { orderAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface OrderItem {
  productid: {
    _id: string;
    productname: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  userid: any;
  products: OrderItem[];
  totalamount: number;
  paymentmode: string;
  status: string;
  orderdate: string;
  deliverydate?: string;
  iscancle: boolean;
  shippingaddress: string;
  createdAt: string;
  updatedAt: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user?._id) return;
    
    try {
      setIsLoading(true);
      const response = await orderAPI.getUserOrders(user._id);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?._id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning text-white';
      case 'completed':
        return 'bg-success text-white';
      default:
        return 'bg-muted';
    }
  };

  const getPaymentModeDisplay = (mode: string) => {
    return mode === 'cod' ? 'Cash on Delivery' : 'Online Payment';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <Package className="h-24 w-24 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">No orders yet</h2>
            <p className="text-muted-foreground">
              Start shopping to see your orders here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          My Orders
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.orderdate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {getPaymentModeDisplay(order.paymentmode)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ₹{order.totalamount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Products */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.products.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={item.productid.image || '/placeholder.svg'}
                            alt={item.productid.productname}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productid.productname}</h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₹{(item.productid.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹{item.productid.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Shipping Address */}
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Shipping Address
                  </h3>
                  <p className="text-sm text-muted-foreground pl-6">
                    {order.shippingaddress}
                  </p>
                </div>

                {order.deliverydate && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center">
                        <Truck className="h-4 w-4 mr-2" />
                        Delivery Information
                      </h3>
                      <p className="text-sm text-muted-foreground pl-6">
                        Expected delivery: {new Date(order.deliverydate).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;