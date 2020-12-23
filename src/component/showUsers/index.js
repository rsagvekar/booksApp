import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Card, CardItem, Left, Body, Thumbnail } from "native-base";
import styles from "./styles";
import { FONTS, COLORS, SIZES, icons } from "../../constants";

const ShowUsers = ({ id, name, img, author, onImgTap, onNameTap, bookmark }) => {
  return (
    <Card style={styles.cardStyle}>
      <CardItem style={styles.cardItemStyle}>
        <Left>
          <TouchableOpacity style={[styles.logoContainer]} onPress={onImgTap}>
            {img ? (
              <Thumbnail source={{ uri: img }} resizeMode="contain" />
            ) : (
                <Text style={styles.thumbnailName}>{name.charAt(0)}</Text>
              )}
          </TouchableOpacity>

          <Body>
            <Text style={styles.profileName} onPress={onNameTap}>
              {name}
            </Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem>
        <View style={{flexDirection: "row"}}>
        
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              backgroundColor: COLORS.secondary,
              marginLeft: 5,
              marginTop: -20,
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={bookmark}
          >
            
            <Image
              source={icons.bookmark_icon}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: COLORS.lightGray2
              }}
            />

          </TouchableOpacity>
          <Text style={{marginTop: -15, marginLeft: 10, fontSize: 15, fontWeight: "bold"}}>Bookmark This Book</Text>
          
        </View>
      </CardItem>
    </Card>
  );
};

export default ShowUsers;
