
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Ionicons from "react-native-vector-icons/Ionicons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../FirebaseConfig"; 

const { width } = Dimensions.get("window");

const chartData = [
  {
    title: "Sales Distribution",
    data: [
      { value: 20, label: "Electronics", color: "#FF6384" },
      { value: 10, label: "Clothing", color: "#36A2EB" },
      { value: 40, label: "Groceries", color: "#FFCE56" },
      { value: 30, label: "Furniture", color: "#4BC0C0" },
    ],
  },
  {
    title: "Expense Breakdown",
    data: [
      { value: 35, label: "Rent", color: "#9966FF" },
      { value: 25, label: "Salaries", color: "#FF9933" },
      { value: 20, label: "Utilities", color: "#00CC99" },
      { value: 20, label: "Marketing", color: "#FF6666" },
    ],
  },
  {
    title: "Survey Results",
    data: [
      { value: 45, label: "Satisfied", color: "#4BC0C0" },
      { value: 30, label: "Neutral", color: "#36A2EB" },
      { value: 15, label: "Dissatisfied", color: "#FF6384" },
      { value: 10, label: "N/A", color: "#CCCCCC" },
    ],
  },
  {
    title: "Time Allocation",
    data: [
      { value: 40, label: "Development", color: "#FFCE56" },
      { value: 30, label: "Meetings", color: "#9966FF" },
      { value: 20, label: "Testing", color: "#FF9933" },
      { value: 10, label: "Documentation", color: "#00CC99" },
    ],
  },
];

const ChartSlide = React.memo(({ title, data }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [title]);

  return (
    <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
      <Text style={styles.title}>{title}</Text>
      <PieChart data={data} donut innerRadius={80} showText={false} />
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.label}: {item.value}%
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
});

const Graphs = () => {
  const [chartData, setChartData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "charts"));
        const fetchedData = querySnapshot.docs.map(doc => doc.data());
        setChartData(fetchedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);
  
  const handleScroll = (event) => {
    const slide = Math.round(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width
    );
    if (slide !== currentSlide) {
      setCurrentSlide(slide);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextSlide = (currentSlide + 1) % chartData.length;
      flatListRef.current?.scrollToOffset({
        offset: nextSlide * width,
        animated: true,
      });
      setCurrentSlide(nextSlide);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentSlide]);

  const goToNextSlide = () => {
    const nextSlide = (currentSlide + 1) % chartData.length;
    flatListRef.current?.scrollToOffset({
      offset: nextSlide * width,
      animated: true,
    });
    setCurrentSlide(nextSlide);
  };

  const goToPrevSlide = () => {
    const prevSlide =
      currentSlide === 0 ? chartData.length - 1 : currentSlide - 1;
    flatListRef.current?.scrollToOffset({
      offset: prevSlide * width,
      animated: true,
    });
    setCurrentSlide(prevSlide);
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {chartData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentSlide ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={chartData}
        renderItem={({ item }) => <ChartSlide {...item} />}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScroll}
      />
      {renderDots()}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.leftArrow} onPress={goToPrevSlide}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightArrow} onPress={goToNextSlide}>
          <Ionicons name="chevron-forward" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  slide: {
    width: width - 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 30,
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
    marginBottom: 15,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#555",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#bbb",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  arrowButton: {
    backgroundColor: "#007BFF",
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  leftArrow: {
    position: "absolute",
    left: 10,
    top: "50%",
    marginTop: -25,
    backgroundColor: "#007BFF",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 5,
  },
  rightArrow: {
    position: "absolute",
    right: 10,
    top: "50%",
    marginTop: -25,
    backgroundColor: "#007BFF",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 5,
  },
});

export default Graphs;