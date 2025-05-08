import {
  _entering,
  _layout,
  AnimatedPressable,
} from "@/src/constants/Animation";
import { categoryData } from "@/src/constants/Colors";
import useAuthStore from "@/src/store/authStore";
import { PurchaseDetailsType } from "@/src/types/purchase.type";
import { formatCurrency, successToast } from "@/src/utils/helperFunction";
import { useCreatePurchase } from "@/src/utils/query/purchaseQuery";
import {
  createPurchaseSchema,
  TCreatePurchaseSchema,
} from "@/src/validations/form";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateExpenseModal = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryData, setSelectedCategoryData] = useState<
    (typeof categoryData)[0] | null
  >(null);
  const [openCategoryBox, setOpenCategoryBox] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { user } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreatePurchase();

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<TCreatePurchaseSchema>({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues: {
      category: "",
      item_name: "",
      quantity: 1,
      price: 0,
      total: 0,
      created_at: "",
    },
  });

  useEffect(() => {
    if (selectedCategory) {
      setValue("category", selectedCategory);
    }
  }, [selectedCategory, setValue]);

  const handleSelectCategory = (categoryName: string) => {
    const data = categoryData.find((cat) => cat.cName === categoryName) || null;
    setSelectedCategory(categoryName);
    setSelectedCategoryData(data);
    setOpenCategoryBox(false);
  };

  const watchedPrice = watch("price");
  const watchedQuantity = watch("quantity");
  const total =
    ((Number.isNaN(watchedQuantity) ? 1 : watchedQuantity) || 1) *
    (watchedPrice || 0);

  const handleSave = async (data: TCreatePurchaseSchema) => {
    const { created_at, ...rest } = data;

    const payload = {
      ...rest,
      created_at: created_at,
    };

    mutate([payload], {
      onSuccess: (returnedData) => {
        queryClient.setQueryData(
          ["userAllPurchase", userId],
          (old: PurchaseDetailsType[]) => {
            if (!old && returnedData) return [returnedData];
            if (returnedData) return [returnedData, ...old];
            return old;
          }
        );
        reset();
        router.replace("/(main)/(tabs)");
        successToast("Purchase details added");
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Feather name="x" size={22} />
        </Pressable>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>Create Expense</Text>
        <Pressable
          disabled={isPending}
          onPress={() => {
            setValue("total", total);
            handleSubmit(handleSave)();
          }}
          style={[styles.saveButton, isPending && styles.saveButtonDisabled]}
        >
          {isPending ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Feather name="check" size={22} />
          )}
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.categoryDateContainer}>
          <View style={styles.categoryContainer}>
            <AnimatedPressable
              layout={_layout}
              onPress={() => setOpenCategoryBox((prev) => !prev)}
              style={[styles.categoryButton, { backgroundColor: selectedCategoryData?.color || "#3d3d3d" }]}
            >
              <View style={styles.categoryButtonContent}>
                <View style={styles.categoryIconContainer}>
                  {selectedCategoryData?.iconComponent &&
                    React.createElement(selectedCategoryData.iconComponent, {
                      ...selectedCategoryData.iconProps,
                      name: selectedCategoryData.iconProps.name as any,
                      color: "#fff",
                    })}
                  <Text style={styles.categoryText}>
                    {selectedCategory || "Select one"}
                  </Text>
                </View>
                <Feather name="chevron-down" size={24} color={"#fff"} />
              </View>
            </AnimatedPressable>

            {openCategoryBox && (
              <View style={styles.categoryDropdown}>
                {categoryData.map((cat) => {
                  const IconComponent = cat.iconComponent;
                  return (
                    <AnimatedPressable
                      entering={_entering}
                      layout={_layout}
                      key={cat.cName}
                      onPress={() => handleSelectCategory(cat.cName)}
                      style={[
                        styles.categoryOption,
                        selectedCategory === cat.cName && styles.selectedCategoryOption
                      ]}
                    >
                      {IconComponent && (
                        <IconComponent
                          {...cat.iconProps}
                          name={cat.iconProps?.name as any}
                          color="black"
                        />
                      )}
                      <Text style={styles.categoryOptionText}>
                        {cat.cName}
                      </Text>
                    </AnimatedPressable>
                  );
                })}
              </View>
            )}

            {errors.category && (
              <Text style={styles.errorText}>{errors.category.message}</Text>
            )}
          </View>

          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Controller
              control={control}
              name="created_at"
              render={({ field: { value, onChange } }) => {
                const handleDateChange = (event: any, selectedDate?: Date) => {
                  if (event.type === "set" && selectedDate) {
                    onChange(selectedDate.toISOString());
                    setShowDatePicker(false);
                  } else if (event.type === "dismissed") {
                    setShowDatePicker(false);
                  }
                };

                return (
                  <>
                    <View style={styles.dateButtonContent}>
                      <Text style={styles.dateText}>
                        {value
                          ? new Date(value).toLocaleDateString()
                          : "Select Date"}
                      </Text>
                      <Feather name="calendar" size={24} color="#CFCFCF" />
                    </View>

                    {showDatePicker && (
                      <DateTimePicker
                        value={value ? new Date(Number(value)) : new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                      />
                    )}
                  </>
                );
              }}
            />
            {errors.created_at && (
              <Text style={styles.errorText}>{errors.created_at.message}</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.quantityPriceContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity (Optional)</Text>
            <Controller
              control={control}
              name="quantity"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Quantity (default 1)"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={String(watchedQuantity)}
                  onChangeText={(text) =>
                    onChange(Number(text.replace(/[^0-9.]/g, "")))
                  }
                  style={styles.input}
                />
              )}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price</Text>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Price"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={value?.toString()}
                  onChangeText={(text) =>
                    onChange(Number(text.replace(/[^0-9.]/g, "")))
                  }
                  style={styles.input}
                />
              )}
            />
            {errors.price && (
              <Text style={styles.errorText}>{errors.price.message}</Text>
            )}
          </View>
        </View>

        <View style={styles.itemNameContainer}>
          <Text style={styles.label}>Item Name</Text>
          <Controller
            control={control}
            name="item_name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Item Name"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
          {errors.item_name && (
            <Text style={styles.errorText}>{errors.item_name.message}</Text>
          )}
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatCurrency(total ?? 0)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateExpenseModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
  },
  saveButtonDisabled: {
    opacity: 0.9,
  },
  scrollView: {
    marginTop: 20,
  },
  categoryDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  categoryContainer: {
    width: '48.5%',
    position: 'relative',
  },
  categoryButton: {
    borderRadius: 16,
    padding: 16,
  },
  categoryButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryText: {
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: '500',
  },
  categoryDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    marginTop: 8,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
  },
  selectedCategoryOption: {
    backgroundColor: '#e5e7eb',
  },
  categoryOptionText: {
    color: '#000',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateButton: {
    width: '48.5%',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#3d3d3d',
  },
  dateButtonContent: {
    backgroundColor: '#3d3d3d',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  quantityPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  inputContainer: {
    width: '48.5%',
  },
  label: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#3d3d3d',
    color: '#fff',
    borderRadius: 16,
    padding: 16,
    height: 56,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 4,
  },
  itemNameContainer: {
    marginTop: 16,
  },
  totalContainer: {
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalLabel: {
    color: '#c2c2c2',
  },
  totalAmount: {
    fontSize: 48,
    color: '#fff',
    marginTop: 8,
  },
});
