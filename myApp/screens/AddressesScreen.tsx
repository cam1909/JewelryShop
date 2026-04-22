import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { api } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddressesScreen() {
  const router = useRouter();
  const { user, isAuthenticated, addresses, fetchUserData } = useAppContext();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // VN API states
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selProv, setSelProv] = useState<any>(null);
  const [selDist, setSelDist] = useState<any>(null);
  const [selWard, setSelWard] = useState<any>(null);

  const [pickerType, setPickerType] = useState<"prov"|"dist"|"ward"|null>(null);
  const [pickerData, setPickerData] = useState<any[]>([]);

  // Lấy danh sách Tỉnh lúc mở Modal form
  useEffect(() => {
    if (modalVisible && provinces.length === 0) {
      fetch('https://provinces.open-api.vn/api/p/')
        .then(r => r.json())
        .then(d => setProvinces(d))
        .catch(e => console.error(e));
    }
  }, [modalVisible]);

  const openPicker = async (type: "prov"|"dist"|"ward") => {
    setPickerType(type);
    if (type === 'prov') {
      setPickerData(provinces);
    } else if (type === 'dist') {
      if (!selProv) { alert('Vui lòng chọn Tỉnh/Thành phố trước!'); setPickerType(null); return; }
      const res = await fetch(`https://provinces.open-api.vn/api/p/${selProv.code}?depth=2`);
      const data = await res.json();
      setDistricts(data.districts);
      setPickerData(data.districts);
    } else if (type === 'ward') {
      if (!selDist) { alert('Vui lòng chọn Quận/Huyện trước!'); setPickerType(null); return; }
      const res = await fetch(`https://provinces.open-api.vn/api/d/${selDist.code}?depth=2`);
      const data = await res.json();
      setWards(data.wards);
      setPickerData(data.wards);
    }
  };

  const selectPickerItem = (item: any) => {
    if (pickerType === 'prov') {
      setSelProv(item);
      setSelDist(null);
      setSelWard(null);
    } else if (pickerType === 'dist') {
      setSelDist(item);
      setSelWard(null);
    } else if (pickerType === 'ward') {
      setSelWard(item);
    }
    setPickerType(null);
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Header title="" showBack={true} />
        </SafeAreaView>
        <View style={styles.center}>
          <Ionicons name="lock-closed-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Đăng nhập để quản lý địa chỉ</Text>
        </View>
      </View>
    );
  }

  const handleSetDefault = async (id: number) => {
    try {
      const res = await api.setDefaultAddress(user.uid, id);
      if (res.success) {
        fetchUserData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAddress = async () => {
    if (!name || !phone || !street || !selProv || !selDist || !selWard) {
      alert("Vui lòng điền và chọn đầy đủ thông tin địa chỉ");
      return;
    }
    setIsSaving(true);
    try {
      const isDefault = addresses.length === 0;
      const fullAddress = `${street}, ${selWard.name}, ${selDist.name}, ${selProv.name}`;
      
      const res = await api.addAddress(user.uid, { name, phone, address: fullAddress, isDefault });
      if (res.success) {
        setModalVisible(false);
        setName(''); setPhone(''); setStreet('');
        setSelProv(null); setSelDist(null); setSelWard(null);
        fetchUserData();
      } else {
        alert("Có lỗi xảy ra");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="" showBack={true} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {addresses.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="location-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Bạn chưa lưu địa chỉ nào</Text>
          </View>
        ) : (
          addresses.map((addr) => (
            <View key={addr.id} style={[styles.addressCard, addr.isDefault && styles.addressCardDefault]}>
              <View style={styles.addressLeft}>
                <View style={styles.nameRow}>
                  <Text style={styles.addrName}>{addr.name}</Text>
                  {addr.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Mặc định</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addrPhone}>{addr.phone}</Text>
                <Text style={styles.addrLine}>{addr.address}</Text>

                {!addr.isDefault && (
                  <TouchableOpacity style={styles.setDefBtn} onPress={() => handleSetDefault(addr.id)}>
                    <Text style={styles.setDefText}>Thiết lập mặc định</Text>
                  </TouchableOpacity>
                )}
              </View>
              {addr.isDefault && (
                <View style={styles.addressRight}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.gold} />
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={20} color={COLORS.black} />
          <Text style={styles.addBtnText}>THÊM ĐỊA CHỈ MỚI</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Add Address */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Thêm Địa Chỉ Giao Hàng</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.inputWrap}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Thông tin người nhận</Text>
                <TextInput style={styles.input} placeholderTextColor={COLORS.textMuted} placeholder="Họ và tên" value={name} onChangeText={setName} />
                <TextInput style={styles.input} placeholderTextColor={COLORS.textMuted} placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Vị trí nhận hàng</Text>
                
                <TouchableOpacity style={styles.locationPicker} onPress={() => openPicker('prov')}>
                  <Text style={[styles.pickerText, !selProv && {color: COLORS.textMuted}]}>
                    {selProv ? selProv.name : 'Chọn Tỉnh / Thành Phố'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.locationPicker} onPress={() => openPicker('dist')}>
                  <Text style={[styles.pickerText, !selDist && {color: COLORS.textMuted}]}>
                    {selDist ? selDist.name : 'Chọn Quận / Huyện'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.locationPicker} onPress={() => openPicker('ward')}>
                  <Text style={[styles.pickerText, !selWard && {color: COLORS.textMuted}]}>
                    {selWard ? selWard.name : 'Chọn Phường / Xã'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TextInput 
                  style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
                  placeholderTextColor={COLORS.textMuted} 
                  placeholder="Tên đường, Toà nhà, Số nhà..." 
                  value={street} 
                  onChangeText={setStreet} 
                  multiline 
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>HUỶ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddAddress} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color={COLORS.black} /> : <Text style={styles.saveBtnText}>LƯU ĐỊA CHỈ</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sub-modal cho việc chọn Tỉnh/Quận/Phường (đặt trong Modal Add Address để đè lên) */}
        {pickerType !== null && (
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerCard}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>
                  {pickerType === 'prov' ? 'Chọn Tỉnh/Thành' : pickerType === 'dist' ? 'Chọn Quận/Huyện' : 'Chọn Phường/Xã'}
                </Text>
                <TouchableOpacity onPress={() => setPickerType(null)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              {pickerData.length === 0 ? (
                <View style={styles.pickerLoader}>
                  <ActivityIndicator size="large" color={COLORS.gold} />
                </View>
              ) : (
                <FlatList
                  data={pickerData}
                  keyExtractor={(item) => String(item.code)}
                  renderItem={({item}) => (
                    <TouchableOpacity style={styles.pickerItem} onPress={() => selectPickerItem(item)}>
                      <Text style={styles.pickerItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.lg },
  
  emptyWrap: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textMuted, marginTop: SPACING.md, fontSize: FONT_SIZES.md },
  
  addressCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  addressCardDefault: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(201, 169, 110, 0.05)',
  },
  addressLeft: { flex: 1 },
  addressRight: { justifyContent: 'center', paddingLeft: SPACING.md },
  
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  addrName: { color: COLORS.white, fontWeight: 'bold', fontSize: FONT_SIZES.md, marginRight: SPACING.md },
  defaultBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  defaultBadgeText: { color: COLORS.black, fontSize: 10, fontWeight: 'bold' },
  
  addrPhone: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm, marginBottom: 8 },
  addrLine: { color: COLORS.textSecondary, fontSize: FONT_SIZES.sm, lineHeight: 20 },
  
  setDefBtn: {
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  setDefText: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs },

  footer: { padding: SPACING.lg, paddingBottom: SPACING.xxl, backgroundColor: COLORS.bgDark },
  addBtn: {
    backgroundColor: COLORS.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  addBtnText: { color: COLORS.black, fontWeight: 'bold' },

  // Main Modal Add
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: COLORS.bgDark,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalTitle: { color: COLORS.gold, fontSize: FONT_SIZES.xl, fontWeight: 'bold', marginBottom: SPACING.lg, textAlign: 'center' },
  inputWrap: { paddingBottom: SPACING.xl },
  formGroup: { marginBottom: SPACING.lg, gap: SPACING.md },
  label: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '500', marginBottom: 4 },
  input: {
    backgroundColor: COLORS.bgCard,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  locationPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  pickerText: { color: COLORS.white, fontSize: FONT_SIZES.md },
  
  modalActions: { flexDirection: 'row', gap: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.textMuted, padding: SPACING.lg, alignItems: 'center', borderRadius: BORDER_RADIUS.md },
  cancelBtnText: { color: COLORS.textMuted, fontWeight: 'bold' },
  saveBtn: { flex: 2, backgroundColor: COLORS.gold, padding: SPACING.lg, alignItems: 'center', borderRadius: BORDER_RADIUS.md },
  saveBtnText: { color: COLORS.black, fontWeight: 'bold' },

  // Sub Modal Picker
  pickerOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', zIndex: 9999 },
  pickerCard: { backgroundColor: COLORS.bgCard, height: '60%', borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.xl, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  pickerTitle: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: 'bold' },
  pickerItem: { padding: SPACING.lg, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  pickerItemText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md },
  pickerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
