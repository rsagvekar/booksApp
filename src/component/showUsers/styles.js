import { StyleSheet } from "react-native";
import { color } from "../../utility";

export default StyleSheet.create({
  cardStyle: {
    backgroundColor: color.WHITE,
    borderBottomWidth: 1,
    borderColor: color.BLACK,
  },
  cardItemStyle: {
    backgroundColor: color.WHITE,
  },

  logoContainer: {
    height: 70,
    width: 50,
    borderColor: color.WHITE,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.DARK_GRAY,
  },
  thumbnailName: { fontSize: 30, color: color.WHITE, fontWeight: "bold" },
  profileName: { fontSize: 20, color: color.BLACK, fontWeight: "bold" },

});
