import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  darkContainer: {
    backgroundColor: "#111827",
  },
  header: {
    padding: 12,
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 12,
    flex: 1,
  
  },
  headerIcons: {
    flexDirection: "row",
  },
  headerIcon: {
    marginHorizontal: 6,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 6,
  },
  messageContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  myMessage: {
    backgroundColor: "#E1F5FE",
    alignSelf: "flex-end",
    marginLeft: 50,
  },
  otherMessage: {
    backgroundColor: "#e5e7eb",
    alignSelf: "flex-start",
    marginRight: 50,

  },
  myMessageText: {
    color: "black",
    fontSize: 16,
  },
  otherMessageText: {
    color: "#111827",
    fontSize: 16,
  },
  senderName: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 4,
    color: "#374151",
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "#6b7280",
  },
  readIcon: {
    marginLeft: 4,
  },
  imageContainer: {
    marginBottom: 6,
  },
  singleImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: Dimensions.get("window").width * 0.65,
  },
  gridImage: {
    width: Dimensions.get("window").width * 0.65 / 3 - 8,
    height: Dimensions.get("window").width * 0.65 / 3 - 8,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  fileContainer: {
    marginBottom: 6,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginBottom: 4,
  },
  fileIcon: {
    marginRight: 8,
  },
  fileText: {
    fontSize: 14,
    color: "#374151",
  },
  audioContainer: {
    marginBottom: 6,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  audioIcon: {
    marginRight: 8,
  },
  audioText: {
    fontSize: 14,
    color: "#374151",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 8,
    backgroundColor: "white",
  },
  inputIcon: {
    marginHorizontal: 6,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f3f4f6",
    fontSize: 16,
  },
  darkTextInput: {
    backgroundColor: "#1f2937",
    color: "white",
  },
  sendButton: {
    marginLeft: 8,
    padding: 10,
    backgroundColor: "#3b82f6",
    borderRadius: 25,
  },
  editedLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  reactionText: {
    fontSize: 18,
    marginTop: 4,
    textAlign: "right",
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: "#000000cc",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  imageModalContent: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImageContainer: {
    width: Dimensions.get("window").width,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  closeImageButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#00000066",
    borderRadius: 20,
    padding: 8,
  },
  imageCounter: {
    position: "absolute",
    bottom: 20,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#00000066",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  actionModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000066",
  },
  actionModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: 250,
    maxHeight: 300,
    padding: 10,
  },
  darkActionModalContent: {
    backgroundColor: "#1f2937",
  },
  actionListContent: {
    padding: 10,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  actionIcon: {
    marginRight: 10,
  },
  actionText: {
    fontSize: 16,
    color: "#374151",
  },
  destructiveText: {
    color: "#ef4444",
  },
  darkActionText: {
    color: "#d1d5db",
  },
  forwardModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000066",
  },
    forwardRoomAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    forwardRoomName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#000", // Adjust color based on your theme
      marginLeft: 10,
    },
    forwardRoomItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc", // Adjust color based on your theme
    },
    forwardModalCloseText: {
      color: "blue",
      fontSize: 16,
      textAlign: "center",
      marginTop: 10,
    },
  forwardModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: 300,
    maxHeight: 400,
    padding: 20,
  },
  darkForwardModalContent: {
    backgroundColor: "#1f2937",
  },
  noRoomsText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
  },
  darkNoRoomsText: {
    color: "#9ca3af",
  },
  forwardModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#374151",
  },
  darkForwardModalTitle: {
    color: "#d1d5db",
  },
  chatListContent: {
    paddingVertical: 10,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatName: {
    fontSize: 16,
    color: "#374151",
  },
  darkChatName: {
    color: "#d1d5db",
  },
  cancelForwardButton: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelForwardText: {
    fontSize: 16,
    color: "#3b82f6",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  darkSearchContainer: {
    backgroundColor: "#1f2937",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f3f4f6",
    fontSize: 16,
    marginRight: 10,
  },
  darkSearchInput: {
    color: "white",
    backgroundColor: "#374151",
  },
  cancelSearchButton: {
    paddingHorizontal: 10,
  },
  cancelSearchText: {
    fontSize: 16,
    color: "#3b82f6",
  },
  typingIndicator: {
    marginLeft: 16,
    marginBottom: 4,
    color: "#4b5563",
    fontStyle: "italic",
  },
  darkTypingIndicator: {
    color: "#d1d5db",
  },
  reactionModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000066",
  },
  reactionModalContent: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
  },
  reactionButton: {
    marginHorizontal: 6,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  flatListContent: {
    padding: 10,
  },
  userInfoModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000066",
  },
  userInfoModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: 300,
    padding: 20,
    alignItems: "center",
  },
  darkUserInfoModalContent: {
    backgroundColor: "#1f2937",
  },
  userInfoAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  userInfoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  darkUserInfoName: {
    color: "#d1d5db",
  },
  userInfoDetail: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 4,
  },
  userInfoIcon: {
    marginRight: 8,
  },
  userInfoText: {
    fontSize: 16,
    color: "#374151",
  },
  userInfoTextHeader: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    minWidth: "30%"
  },
  darkUserInfoText: {
    color: "#d1d5db",
  },
  closeUserInfoButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "green",
    borderRadius: 8,
  },
  closeUserInfoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;