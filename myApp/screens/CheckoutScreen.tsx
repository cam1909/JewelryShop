import { useAppContext } from "@/context/AppContext";
import { db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CheckoutScreen = () => {
  const router = useRouter();
  const { cart, cartTotal, user, clearCart, formatPrice } = useAppContext();

  const shipping = cartTotal >= 10000000 ? 0 : 50000;
  const total = cartTotal + shipping;

  const handleConfirmOrder = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống.");
      return;
    }

    try {
      // Create an order in Firestore
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cart,
        total: total,
        shipping: shipping,
        status: "pending",
        createdAt: serverTimestamp(),
        paymentMethod: "COD", // Cash on Delivery as default for now
      });

      // Clear the cart
      clearCart();

      // Navigate to a success screen or back home
      alert("Đơn hàng của bạn đã được đặt thành công!");
      router.push("/(tabs)");

    } catch (error) {
      console.error("Error creating order: ", error);
      alert("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          {cart.map(item => (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemQuantity}>SL: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt thanh toán</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{formatPrice(cartTotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

         <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.paymentMethod}>
            <Text style={styles.paymentText}>Thanh toán khi nhận hàng (COD)</Text>
            <Ionicons name="checkmark-circle" size={24} color="green" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleConfirmOrder}>
          <Text style={styles.buttonText}>XÁC NHẬN ĐẶT HÀNG</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    color: '#333'
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemDetails: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    color: '#555',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;

