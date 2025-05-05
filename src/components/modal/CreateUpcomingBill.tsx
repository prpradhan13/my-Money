import {
    AnimatedPressable,
    _entering,
    _layout,
} from "@/src/constants/Animation";
import { categoryData } from "@/src/constants/Colors";
import useAuthStore from "@/src/store/authStore";
import { UpcomingBillType } from "@/src/types/upcomingBill.type";
import { formatCurrency, successToast } from "@/src/utils/helperFunction";
import { useCreateUpcomingBill } from "@/src/utils/query/upcomingBillQuery";
import {
    TCreateUpcomingBillSchema,
    createUpcomingBillSchema,
} from "@/src/validations/form";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

interface ICreateUpcomingBill {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const CreateUpcomingBill = ({
  isVisible,
  setIsVisible,
}: ICreateUpcomingBill) => {
  const [openCategoryBox, setOpenCategoryBox] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState<
    (typeof categoryData)[0] | null
  >(null);
  const [showDate, setShowDate] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;
  const { mutate: createUpcomingBill, isPending } = useCreateUpcomingBill();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TCreateUpcomingBillSchema>({
    resolver: zodResolver(createUpcomingBillSchema),
    defaultValues: {
      title: "",
      category: "",
      amount: 0,
      day_of_month: 1,
      is_recurring: false,
      remind_before_days: 5,
      note: "",
    },
  });

  const watchedAmount = watch("amount");
  const watchedIsRecurring = watch("is_recurring");

  useEffect(() => {
    if (selectedCategory) {
      setValue("category", selectedCategory);
    }
  }, [setValue, selectedCategory]);

  useEffect(() => {
    if (showDate) {
      setValue("day_of_month", 1);
    }
  }, [showDate, setValue]);

  const handleCloseDropdowns = () => {
    setOpenCategoryBox(false);
    setShowDate(false);
  };

  const handleSelectCategory = (categoryName: string) => {
    const data = categoryData.find((cat) => cat.cName === categoryName) || null;
    setSelectedCategory(categoryName);
    setSelectedCategoryData(data);
    setOpenCategoryBox(false);
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setValue("day_of_month", day);
    setShowDate(false);
  };

  const handleCategoryButtonClick = (e: any) => {
    e.stopPropagation();
    setOpenCategoryBox((prev) => !prev);
  };

  const handleDateButtonClick = (e: any) => {
    e.stopPropagation();
    setShowDate((prev) => !prev);
  };

  const onRequestClose = () => {
    reset();
    setSelectedCategory(null);
    setSelectedCategoryData(null);
    setSelectedDay(1);
    handleCloseDropdowns();
    setIsVisible(false);
  };

  const onSubmit = (data: TCreateUpcomingBillSchema) => {
    createUpcomingBill(data, {
      onSuccess: (returnedData) => {
        queryClient.setQueryData(
          ["allCreatedBills", userId],
          (old: UpcomingBillType[]) => {
            if (!old && returnedData) return [returnedData];
            if (returnedData) return [returnedData, ...old];
            return old;
          }
        );
        onRequestClose();
        router.replace("/(main)/(tabs)");
        successToast("Bill created");
      },
    });
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleCloseDropdowns}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <Pressable onPress={onRequestClose} style={styles.closeButton}>
              <Feather name="x" size={22} color="#000" />
            </Pressable>
            <Pressable
              disabled={isPending}
              onPress={handleSubmit(onSubmit)}
              style={[
                styles.saveButton,
                isPending && styles.saveButtonDisabled,
              ]}
            >
              {isPending ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Feather name="check" size={22} color="#000" />
              )}
            </Pressable>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value}
                    onChangeText={(text) => field.onChange(text)}
                    placeholder="Bill name"
                    placeholderTextColor="#9ca3af"
                    style={styles.input}
                  />
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount</Text>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value.toString()}
                    onChangeText={(text) => {
                      const numericValue = parseFloat(text);
                      if (!isNaN(numericValue)) {
                        field.onChange(numericValue);
                      }
                    }}
                    placeholder="Amount"
                    placeholderTextColor="#9ca3af"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>

            <View style={styles.categoryDateContainer}>
              <View style={styles.categoryContainer}>
                <AnimatedPressable
                  layout={_layout}
                  onPress={handleCategoryButtonClick}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: selectedCategoryData?.color || "#374151",
                    },
                  ]}
                >
                  <View style={styles.categoryButtonContent}>
                    <View style={styles.categoryIconContainer}>
                      {selectedCategoryData?.iconComponent &&
                        React.createElement(
                          selectedCategoryData.iconComponent,
                          {
                            ...selectedCategoryData.iconProps,
                            name: selectedCategoryData.iconProps.name as any,
                            color: "#fff",
                          }
                        )}
                      <Text style={styles.categoryText}>
                        {selectedCategory || "Select category"}
                      </Text>
                    </View>
                    <Feather name="chevron-down" size={24} color={"#fff"} />
                  </View>
                </AnimatedPressable>

                {openCategoryBox && (
                  <View style={styles.categoryDropdown}>
                    <ScrollView style={styles.categoryScrollView}>
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
                              selectedCategory === cat.cName &&
                                styles.selectedCategoryOption,
                            ]}
                          >
                            {IconComponent && (
                              <IconComponent
                                {...cat.iconProps}
                                name={cat.iconProps?.name as any}
                              />
                            )}
                            <Text style={styles.categoryOptionText}>
                              {cat.cName}
                            </Text>
                          </AnimatedPressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

                {errors.category && (
                  <Text style={styles.errorText}>
                    {errors.category.message}
                  </Text>
                )}
              </View>

              <View style={styles.dateContainer}>
                <AnimatedPressable
                  layout={_layout}
                  onPress={handleDateButtonClick}
                  style={styles.dateButton}
                >
                  <View style={styles.dateButtonContent}>
                    <View style={styles.dateTextContainer}>
                      <Text style={styles.dateText}>
                        {selectedDay ? `Day ${selectedDay}` : "Select day"}
                      </Text>
                    </View>
                    <Feather name="chevron-down" size={24} color={"#fff"} />
                  </View>
                </AnimatedPressable>

                {showDate && (
                  <View style={styles.dateDropdown}>
                    <ScrollView style={styles.dateScrollView}>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (day) => (
                          <AnimatedPressable
                            entering={_entering}
                            layout={_layout}
                            key={day}
                            onPress={() => handleSelectDay(day)}
                            style={[
                              styles.dateOption,
                              selectedDay === day && styles.selectedDateOption,
                            ]}
                          >
                            <Text style={styles.dateOptionText}>Day {day}</Text>
                          </AnimatedPressable>
                        )
                      )}
                    </ScrollView>
                  </View>
                )}

                {errors.day_of_month && (
                  <Text style={styles.errorText}>
                    {errors.day_of_month.message}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.reminderContainer}>
              <View style={styles.reminderRow}>
                <Text style={styles.reminderText}>*Remind you before 5 days</Text>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Recurring</Text>
                  <Switch
                    value={watchedIsRecurring}
                    onValueChange={(value) => setValue("is_recurring", value)}
                    trackColor={{ false: "#4b5563", true: "#3b82f6" }}
                    thumbColor="#fff"
                  />
                </View>
              </View>
            </View>

            <View style={styles.amountPreviewContainer}>
              <Text style={styles.amountPreview}>
                {formatCurrency(watchedAmount ?? 0)}
              </Text>
              <Text style={styles.amountPreviewSubtext}>/month</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default CreateUpcomingBill;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#1f2937",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#374151",
    borderWidth: 1,
    borderColor: "#4b5563",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },
  categoryDateContainer: {
    flexDirection: "row",
    gap: 16,
  },
  categoryContainer: {
    flex: 1,
    position: "relative",
  },
  dateContainer: {
    flex: 1,
    position: "relative",
  },
  categoryButton: {
    borderRadius: 12,
    padding: 16,
  },
  dateButton: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#374151",
  },
  categoryButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  categoryDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 20,
    maxHeight: 200,
  },
  dateDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 20,
    maxHeight: 200,
  },
  categoryScrollView: {
    maxHeight: 200,
  },
  dateScrollView: {
    maxHeight: 200,
  },
  categoryOption: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateOption: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectedCategoryOption: {
    backgroundColor: "#f3f4f6",
  },
  selectedDateOption: {
    backgroundColor: "#f3f4f6",
  },
  categoryOptionText: {
    color: "#1f2937",
    fontSize: 16,
    fontWeight: "500",
  },
  dateOptionText: {
    color: "#1f2937",
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  reminderContainer: {
    marginTop: 8,
  },
  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reminderText: {
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  amountPreviewContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginTop: 24,
    gap: 8,
  },
  amountPreview: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "600",
  },
  amountPreviewSubtext: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "500",
  },
});
