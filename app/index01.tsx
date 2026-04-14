import { Image, Text, View } from "react-native";

type StudentInfoProps = {
  stdname: string;
  id: string;
};

const StudentInfo = ({ stdname, id }: StudentInfoProps) => {
  return (
    <View>
      <Text>姓名：{stdname}</Text>
      <Text>學號：{id}</Text>
      <Text>---</Text>
    </View>
  );
};

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>【班級名單】</Text>
      <StudentInfo stdname="張小明" id="A001" />
      <StudentInfo stdname="李大華" id="A002" />
      <StudentInfo stdname="王美玲" id="A003" />
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1773061865077-12120d59a217?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={{ width: "100%", height: "40%" }}
        // resizeMode 可選值：
        // "cover"   - 等比縮放填滿容器，超出部分裁切（預設值）
        // "contain" - 等比縮放，完整顯示在容器內，可能有留白
        // "stretch" - 拉伸填滿容器，不保持比例
        // "repeat"  - 原始尺寸重複平鋪（僅 iOS）
        // "center"  - 原始尺寸置中，不縮放
        resizeMode="contain"
      />
    </View>
  );
}
