import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: 'rgba(0,0,0, 0.5)'
  },
  container: {
    margin: 0,
    alignItems: undefined,
    justifyContent: undefined,
  },
  activityIndicatorWrapper: {
    backgroundColor: "#ffffff",
    height: 110,
    width: 110,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  text: {
    fontSize: 14,
    fontWeight: "400"
  }
});

export default styles;
