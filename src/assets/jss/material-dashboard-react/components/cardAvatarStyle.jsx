const cardAvatarStyle = {
  cardAvatar: {
    "&$cardAvatarProfile img": {
      width: "100%",
      height: "auto"
    }
  },
  cardAvatarProfile: {
    maxWidth: "35px",
    maxHeight: "35px",
    margin: "0px",
    borderRadius: "50%",
    overflow: "hidden",
    padding: "0",
    boxShadow:
      "0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    "&$cardAvatarPlain": {
      marginTop: "0"
    }
  },
  cardAvatarProfileText: {
    position: "absolute",
    left: "70px",
    top: "25px",
    color: "white",
    textTransform: "lowercase",
    fontSize: "17px"
  },
  cardAvatarPlain: {}
};

export default cardAvatarStyle;
