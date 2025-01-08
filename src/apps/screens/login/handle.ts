import { images } from "@/src/assets/images";

interface Language {
   [key: string]: {
      login: string;
      createAccount: string;
      pages: {
         title: string;
         description: string;
         image: any;
      }[];
   }
}

export const texts: Language = {
    vi: {
      login: "Đăng nhập",
      createAccount: "Tạo tài khoản mới",
      pages: [
        {
          title: "Gọi video ổn định",
          description: "Trò chuyện thật đã với chất lượng video ổn định mọi lúc, mọi nơi",
          image: images.logo
        },
        {
          title: "Chat nhóm tiện ích",
          description: "Nơi cùng nhau trao đổi, giữ liên lạc với gia đình, bạn bè, đồng nghiệp...",
          image: images.logo
        },
        {
          title: "Gửi ảnh nhanh chóng",
          description: "Trao đổi hình ảnh chất lượng cao với bạn bè và người thân nhanh và dễ dàng",
          image: images.logo
        },
        {
          title: "Nhật ký bạn bè",
          description: "Nơi cập nhật hoạt động mới nhất của những người bạn quan tâm",
          image: images.logo
        },
      ],
    },
    en: {
      login: "Login",
      createAccount: "Create New Account",
      pages: [
        {
          title: "Stable Video Calls",
          description: "Chat easily with stable video quality anytime, anywhere",
          image: images.logo
        },
        {
          title: "Group Chat with Features",
          description: "Group chat made easy with great features.",
          image: images.logo
        },
        {
          title: "Send Photos Quickly",
          description: "Exchange high-quality photos with friends and family easily and quickly",
          image: images.logo
        },
        {
          title: "Friends Journal",
          description: "Stay updated with the latest activities of your friends.",
          image: images.logo
        },
      ],
    },
  };