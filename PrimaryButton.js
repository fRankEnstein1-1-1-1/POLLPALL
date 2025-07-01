import { Pressable, View, Text, StyleSheet } from "react-native";
function PrimaryButton({ children, style, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "white" }}
    >
      <Text style={style}>{children}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({});
export default PrimaryButton;